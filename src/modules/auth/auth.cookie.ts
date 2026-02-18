export function getCookieConfig() {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    access: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      maxAge: 15 * 60 * 1000,
      path: '/',
    },
    refresh: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refreshToken',
    },
    clear: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ('none' as const) : ('lax' as const),
      path: '/',
    },
  };
}
