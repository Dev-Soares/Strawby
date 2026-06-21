import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN;

const baseCookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'lax' : 'strict',
  path: '/',
  ...(cookieDomain && { domain: cookieDomain }),
};

export const cookieConfig: CookieOptions = {
  ...baseCookieConfig,
  maxAge: 1000 * 60 * 15, // 15m — alinhado ao access token
};

export const refreshCookieConfig: CookieOptions = {
  ...baseCookieConfig,
  maxAge: 1000 * 60 * 60 * 24 * 60, // 60d — alinhado ao refresh token
};
