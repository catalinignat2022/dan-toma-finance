import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ro'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Locale detection
  localeDetection: true,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|ro)/:path*'],
};
