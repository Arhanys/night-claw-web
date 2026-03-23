import { getToken } from "next-auth/jwt"
import { createI18nMiddleware } from "next-international/middleware"
import { NextRequest, NextResponse } from "next/server"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (/^\/(en|fr)\/dashboard/.test(pathname)) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url))
    }
  }

  return I18nMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
}
