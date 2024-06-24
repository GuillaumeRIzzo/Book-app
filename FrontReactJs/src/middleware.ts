import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const protectedRoutes = [
    '/edit/author/:id',
    '/author/add',
    '/edit/book/:id',
    '/book/add',
    '/edit/bookcategory/:id',
    '/bookcategory/add',
    '/edit/publisher/:id',
    '/publisher/add',
    '/users',
    '/user/:id'
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    new RegExp(`^${route.replace(/:\w+/g, '[^/]+')}$`).test(pathname)
  );

  if (isProtectedRoute) {
    // If no token exists or the token doesn't have the required rights, redirect to the home page
    if (!token || !['Super Admin', 'Admin'].includes(token.right)) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/edit/author/:id*',
    '/author/add',
    '/edit/book/:id*',
    '/book/add',
    '/edit/bookcategory/:id*',
    '/bookcategory/add',
    '/edit/publisher/:id*',
    '/publisher/add',
    '/users',
    '/user/:id',
  ],
};
