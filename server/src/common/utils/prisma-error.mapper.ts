import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

type PrismaErrorOverrides = {
  p2000?: string;
  p2002?: string;
  p2003?: string;
  p2011?: string;
  p2014?: string;
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

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new BadRequestException('Dados inválidos para a operação');
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000':
        throw new BadRequestException(
          overrides?.p2000 ?? 'Valor excede o tamanho permitido',
        );
      case 'P2002':
        throw new ConflictException(
          overrides?.p2002 ?? 'Registro já existe',
        );
      case 'P2003':
        throw new BadRequestException(
          overrides?.p2003 ?? 'Referência inválida (registro relacionado não existe)',
        );
      case 'P2011':
        throw new BadRequestException(
          overrides?.p2011 ?? 'Campo obrigatório ausente',
        );
      case 'P2014':
        throw new BadRequestException(
          overrides?.p2014 ?? 'Operação viola relação obrigatória entre registros',
        );
      case 'P2025':
        throw new NotFoundException(
          overrides?.p2025 ?? 'Registro não encontrado',
        );
    }
  }

  throw new InternalServerErrorException(fallbackMessage, { cause: error });
}
