import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const cookieDomain = process.env.COOKIE_DOMAIN;

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  ...(cookieDomain && { domain: cookieDomain }),
  maxAge: 1000 * 60 * 60 * 24,
};
