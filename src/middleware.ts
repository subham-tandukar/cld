import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url, 'https://calendar.onlinekhabar.com/');

  if (pathname === '/api/auth/signin' && (searchParams.get('error') === 'Callback' || searchParams.get('error') === 'OAuthSignin')) {
    return NextResponse.redirect('https://calendar.onlinekhabar.com/login');
  } else {
    return NextResponse.next();
  }
}
  
export const config = {
  api: {
    bodyParser: false,
  },
};
