import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { DailyScoreService } from '../daily-score/daily-score.service';

type UserPublic = Pick<User, 'id' | 'name' | 'email'> & {
  score?: number | null;
};

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly dailyScoreService: DailyScoreService,
  ) {}

  async create(data: CreateUserDto): Promise<UserPublic> {
    const hashedPassword = await this.hashService.hashPassword(data.password);
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          plan: {
            create: {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar usuário', {
        p2002: 'E-mail já cadastrado',
      });
    }
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Email ou senha inválidos');
      }

      return user;
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar usuário');
    }
  }

  async findOne(id: string): Promise<UserPublic> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const score = await this.dailyScoreService.getAverageScoreByUser(id);

      return { ...user, score };
    } catch (error) {
      mapPrismaError(error, 'Erro ao buscar usuário');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserPublic> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.email !== undefined && { email: dto.email }),
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
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
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao deletar usuário', {
        p2025: 'Usuário não encontrado',
      });
    }
  }
}
