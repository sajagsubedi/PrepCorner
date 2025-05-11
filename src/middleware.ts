import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        if (pathname == "/") {
          return true;
        }

        if (
          pathname.startsWith("/api") ||
          pathname.startsWith("/signin") ||
          pathname.startsWith("/signup") ||
          pathname.startsWith("/verify")
        ) {
          return true;
        }

        if (pathname.startsWith("/assets")) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
