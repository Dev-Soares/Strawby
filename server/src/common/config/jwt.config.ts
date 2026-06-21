import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';

export const getAccessTokenConfig = (configService: ConfigService): JwtSignOptions => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  expiresIn: '15m',
});

export const getRefreshTokenConfig = (configService: ConfigService): JwtSignOptions => ({
  secret: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
  expiresIn: '60d',
});
