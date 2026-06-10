import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import type { AuthenticatedRequest } from 'src/common/types/req-types';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { cookieConfig } from 'src/common/config/cookie.config';
import type { SignInResponse, LogoutResponse } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const result = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    res.cookie('access_token', result.access_token, cookieConfig);
    return { message: 'Login efetuado com sucesso' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): LogoutResponse {
    res.clearCookie('access_token', cookieConfig);
    return { message: 'Logout efetuado com sucesso' };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refresh(req.user.sub);
    res.cookie('access_token', result.access_token, cookieConfig);
    return { message: 'Token renovado' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('google')
  async googleAuth(
    @Body('credential') credential: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const result = await this.authService.googleAuth(credential);

    res.cookie('access_token', result.access_token, cookieConfig);
    return { message: 'Login com Google efetuado com sucesso' };
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const result = await this.authService.verifyEmail(token);
    res.cookie('access_token', result.access_token, cookieConfig);
    return { message: 'E-mail verificado com sucesso' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-verification')
  async resendVerification(
    @Body('email') email: string,
  ) {
    await this.authService.resendVerificationEmail(email);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.sendResetPasswordEmail(dto.email);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.resetPassword(dto.token, dto.newPassword);
    res.cookie('access_token', result.access_token, cookieConfig);
    return { message: 'Senha redefinida com sucesso' };
  }
}
