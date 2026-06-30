import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleClient } from './google-client/client';
import { UserModule } from '../user/user.module';
import { HashModule } from '../../common/hash/hash.module';
import { AuthGuardModule } from '../../common/guards/auth/auth.module';
import { getAccessTokenConfig } from 'src/common/config/jwt.config';

@Module({
  imports: [
    UserModule,
    HashModule,
    AuthGuardModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: getAccessTokenConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleClient],
})
export class AuthModule {}
