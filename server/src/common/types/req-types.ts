export type RequestTokenPayload = {
  sub: string;
  name: string;
  role: string;
}

export type AuthenticatedRequest = {
  user: RequestTokenPayload;
}

export type OptionalAuthRequest = {
  user: RequestTokenPayload | null;
}