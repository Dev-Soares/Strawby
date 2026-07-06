import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { RequestTokenPayload } from 'src/common/types/req-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: RequestTokenPayload }>();
    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'RolesGuard aplicado sem AuthGuard antes — request.user ausente',
      );
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Sem permissão para acessar este recurso');
    }

    return true;
  }
}
