import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleClient {
  private readonly client: OAuth2Client;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? '';
    this.client = new OAuth2Client(
      this.clientId,
      this.configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
    );
  }

  getToken(code: string, redirectUri: string) {
    return this.client.getToken({ code, redirect_uri: redirectUri });
  }

  verifyIdToken(idToken: string) {
    return this.client.verifyIdToken({ idToken, audience: this.clientId });
  }
}
