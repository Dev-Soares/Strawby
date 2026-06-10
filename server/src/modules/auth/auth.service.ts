import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from 'src/common/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponse } from './types';
import { googleClient } from './google-client/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (!user.password) {
      throw new UnauthorizedException('Esta conta usa login com Google');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException('E-mail não verificado');
    }

    const passwordValid = await this.hashService.comparePassword(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = { sub: user.id, name: user.name, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async refresh(userId: string): Promise<AuthTokenResponse> {
    const user = await this.usersService.findOne(userId);
    const payload = { sub: user.id, name: user.name, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async googleAuth(credential: string): Promise<AuthTokenResponse> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const googlePayload = ticket.getPayload();

      if (!googlePayload?.email || !googlePayload?.name) {
        throw new UnauthorizedException('Token Google inválido');
      }

      const { email, name } = googlePayload;

      const existingUser = await this.usersService.findByEmailWithPassword(email);
      const userForToken = existingUser ?? await this.usersService.createFromGoogle(email, name);

      const tokenPayload = { sub: userForToken.id, name: userForToken.name, role: userForToken.role };
      const access_token = await this.jwtService.signAsync(tokenPayload);

      return { access_token };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Erro ao autenticar com Google');
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    return this.usersService.resendVerificationEmail(email);
  }

  async verifyEmail(token: string): Promise<AuthTokenResponse> {
    const user = await this.usersService.findOneByVerificationToken(token);

    if (!user) {
      throw new UnauthorizedException('Token de verificação inválido ou expirado');
    }

    const verifiedUser = await this.usersService.markEmailAsVerified(user.id);
    const payload = { sub: verifiedUser.id, name: verifiedUser.name, role: verifiedUser.role };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async resetPassword(token: string, newPassword: string): Promise<AuthTokenResponse> {
    const user = await this.usersService.findOneByPasswordResetToken(token);

    if (!user) {
      throw new UnauthorizedException('Token de redefinição inválido ou expirado');
    }

    const hashedPassword = await this.hashService.hashPassword(newPassword);
    const updatedUser = await this.usersService.resetPassword(user.id, hashedPassword);

    const payload = { sub: updatedUser.id, name: updatedUser.name, role: updatedUser.role };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async sendResetPasswordEmail(email: string): Promise<void> {
    return this.usersService.sendResetPasswordEmail(email);
  }
}
