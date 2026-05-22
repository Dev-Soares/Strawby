import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { RequestTokenPayload } from 'src/common/types/req-types';

@Injectable()
export abstract class BaseJwtGuard {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
  ) {}

  protected verifyToken(token: string): Promise<RequestTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
}
