import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fallbackLng, languages } from './app/i18n/settings';

export function middleware(request: NextRequest) {
  // Get the language from the URL
  const pathname = request.nextUrl.pathname;
  
  // Check if the language is already in the path
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if the language is not in the path
  if (pathnameIsMissingLocale) {
    // Detect the user's preferred language or use the default
    const locale = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || fallbackLng;
    
    // Use the detected language if supported, otherwise use the fallback
    const finalLocale = languages.includes(locale) ? locale : fallbackLng;
    
    return NextResponse.redirect(
      new URL(`/${finalLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
    );
  }
}

export const config = {
  // Matcher ignores static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};