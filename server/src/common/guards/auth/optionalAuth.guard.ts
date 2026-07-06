import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { BaseJwtGuard } from './base-jwt.guard';
import type { RequestTokenPayload } from 'src/common/types/req-types';

@Injectable()
export class OptionalAuthGuard extends BaseJwtGuard implements CanActivate {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & {
        cookies: { access_token?: string };
        user: RequestTokenPayload | null;
      }
    >();
    const token = request.cookies.access_token;

    if (!token) {
      request.user = null;
      return true;
    }

    try {
      request.user = await this.verifyToken(token);
    } catch {
      request.user = null;
    }

    return true;
  }
}
