import { auth0 } from './lib/auth0'

/**
 * Mount Auth0 middleware for App Router style routes. This will handle /auth/* paths.
 */
export async function middleware(request) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: ['/auth/:path*']
}
