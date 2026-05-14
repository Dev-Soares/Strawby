import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';

type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  async create(data: CreateUserDto): Promise<UserPublic> {
    const hashedPassword = await this.hashService.hashPassword(data.password);
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
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
      if (error instanceof UnauthorizedException) throw error
      throw new InternalServerErrorException('Erro ao buscar usuário');
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

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar usuário');
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Usuário não encontrado');
        if (error.code === 'P2002') throw new ConflictException('E-mail já cadastrado');
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar informações do Usuário',
      );
    }
  }

  async remove(id: string): Promise<UserPublic> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Usuário não encontrado');
      }
      throw new InternalServerErrorException('Erro ao deletar usuário');
    }
  }
}

