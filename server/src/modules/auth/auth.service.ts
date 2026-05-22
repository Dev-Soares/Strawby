import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from 'src/common/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenResponse } from './types';

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

    const passwordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = { sub: user.id, name: user.name };

    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
