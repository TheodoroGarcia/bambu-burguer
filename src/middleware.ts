import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rotas que precisam de autenticação
const protectedRoutes = createRouteMatcher([
  "/user(.*)",
  "/admin(.*)", 
  "/seller(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (req.nextUrl.pathname.startsWith("/_next") || 
        req.nextUrl.pathname.includes(".")) {
      return NextResponse.next();
    }

    if (protectedRoutes(req)) {
      await auth.protect();
    }

    return NextResponse.next();
  },
  {
    debug: false
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
