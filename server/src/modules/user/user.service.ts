import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../../common/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mapPrismaError } from '../../common/utils/prisma-error.mapper';
import { UserPublic, userSelect } from './types';

type UserCredentials = Pick<User, 'id' | 'name' | 'password'>;

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
        select: userSelect,
      });
    } catch (error) {
      mapPrismaError(error, 'Erro ao criar usuário', {
        p2002: 'E-mail já cadastrado',
      });
    }
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserCredentials | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, password: true },
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
    try {
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
}
