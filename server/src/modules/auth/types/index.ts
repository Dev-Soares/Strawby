export type AuthTokenResponse = {
  access_token: string;
};

export type AuthTokensResponse = AuthTokenResponse & {
  refresh_token: string;
};

export type SignInResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};
