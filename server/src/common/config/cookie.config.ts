import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  partitioned: isProduction,
  maxAge: 1000 * 60 * 60 * 24, // 1 dia
};
