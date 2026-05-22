import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { cookieConfig } from 'src/common/config/cookie.config';
import type { SignInResponse, LogoutResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponse> {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);

    res.cookie('access_token', result.access_token, cookieConfig)

    return { message: 'Sign In successful' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): LogoutResponse {
    res.clearCookie('access_token', cookieConfig);
    return { message: 'Logged out' };
  }

}
