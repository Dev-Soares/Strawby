import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { UserPublic, userSelect, UserCredentials } from './types';
import { generateVerificationCode } from '../../common/utils/generate-verification-code';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly emailService: EmailService,
  ) {}

  async create(data: CreateUserDto): Promise<UserPublic> {
    const hashedPassword = await this.hashService.hashPassword(data.password);
    const emailVerificationToken = generateVerificationCode();
    const expiringDate = new Date(Date.now() + 60 * 60 * 1000);

    let user: UserPublic;
    try {
      user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          termsAcceptedAt: new Date(),
          termsVersion: data.termsVersion,
          verificationToken: emailVerificationToken,
          verificationTokenExpiresAt: expiringDate,
        },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar usuário', {
        p2002: 'E-mail já cadastrado',
      });
    }

    await this.emailService.sendVerificationEmail(data.email, emailVerificationToken);
    return user!;
  }

  async createFromGoogle(email: string, name: string): Promise<UserPublic> {
    try {
      return await this.prisma.user.create({
        data: { name, email },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar usuário', {
        p2002: 'E-mail já cadastrado',
      });
    }
  }

  async completeOnboarding(
    userId: string,
    dto: CompleteOnboardingDto,
  ): Promise<UserPublic> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          role: dto.role,
          ...(dto.role === 'patient'
            ? {
                patient: {
                  create: {
                    ...(dto.weight !== undefined && { weight: dto.weight }),
                    ...(dto.height !== undefined && { height: dto.height }),
                    ...(dto.age !== undefined && { age: dto.age }),
                    ...(dto.gender !== undefined && { gender: dto.gender }),
                  },
                },
              }
            : { nutritionist: { create: {} } }),
        },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao completar onboarding', {
        p2025: 'Usuário não encontrado',
      });
    }
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserCredentials | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, password: true, role: true, emailVerified: true },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar usuário');
    }
  }

  async findOne(id: string): Promise<UserPublic> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: userSelect,
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar usuário');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserPublic> {
    const hasPatientFields =
      dto.weight !== undefined ||
      dto.height !== undefined ||
      dto.age !== undefined ||
      dto.gender !== undefined;

    try {
      if (hasPatientFields) {
        await this.prisma.patient.updateMany({
          where: { id },
          data: {
            ...(dto.weight !== undefined && { weight: dto.weight }),
            ...(dto.height !== undefined && { height: dto.height }),
            ...(dto.age !== undefined && { age: dto.age }),
            ...(dto.gender !== undefined && { gender: dto.gender }),
          },
        });
      }

      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.email !== undefined && { email: dto.email }),
        },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao atualizar informações do usuário', {
        p2002: 'E-mail já cadastrado',
        p2025: 'Usuário não encontrado',
      });
    }
  }

  async remove(id: string): Promise<UserPublic> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar usuário', {
        p2025: 'Usuário não encontrado',
      });
    }
  }

  async findOneByVerificationToken(token: string): Promise<UserPublic | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpiresAt: { gt: new Date() },
        },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar usuário por token de verificação');
    }
  }

  async markEmailAsVerified(userId: string): Promise<UserPublic> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao verificar e-mail', {
        p2025: 'Usuário não encontrado',
      });
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, emailVerified: true },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');
      if (user.emailVerified) throw new BadRequestException('E-mail já verificado');

      const verificationToken = generateVerificationCode();
      const verificationTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { verificationToken, verificationTokenExpiresAt },
      });

      await this.emailService.sendVerificationEmail(email, verificationToken);

    } catch (error) {

      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      
      mapPrismaError(error, 'Erro ao reenviar e-mail de verificação');
    }
  }

  async clearExpiredVerificationTokens(): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        emailVerified: false,
        verificationTokenExpiresAt: { lt: new Date() },
      },
      data: {
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });
  }
}
