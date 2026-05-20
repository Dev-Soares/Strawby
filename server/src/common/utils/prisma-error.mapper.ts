import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

type PrismaErrorOverrides = {
  p2002?: string;
  p2025?: string;
};

export function mapPrismaError(
  error: unknown,
  fallbackMessage: string,
  overrides?: PrismaErrorOverrides,
): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException(overrides?.p2002 ?? 'Registro já existe');
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(overrides?.p2025 ?? 'Registro não encontrado');
    }
  }

  throw new InternalServerErrorException(fallbackMessage, { cause: error });
}
