import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  if (!session && !isLoginRoute && !isAuthRoute && !isApiRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
