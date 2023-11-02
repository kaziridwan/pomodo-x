import { NextRequest, NextResponse } from 'next/server'
export const config = {
  matcher: [
     /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  // const hostname = req.headers
  //   .get("host");
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  // const hostname = req.headers
  //   .get("host")!
  //   .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);


  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  
  if(url.pathname.startsWith('/http')) {
    const pathNameSanitized = url.pathname.substring(1, url.pathname.length).replace(':/','://');
    const refresherURLToPass = encodeURIComponent(pathNameSanitized+url.search);
    const redirectForNewSessionURL = new URL(`/?refresherVideo="${refresherURLToPass}"`, url.origin);

    return NextResponse.redirect(redirectForNewSessionURL)
  }

  return NextResponse.rewrite(url)
}
