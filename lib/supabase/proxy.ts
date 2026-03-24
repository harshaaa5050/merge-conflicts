import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 🔒 Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/onboarding",
    "/chat",
    "/community",
    "/doctors",
    "/techniques",
  ];

  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // 🚫 Auth pages redirect (NO DB CALL HERE)
  const isAuthPage =
    path.startsWith("/auth/login") || path.startsWith("/auth/sign-up");

  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard"; // simple safe redirect
    return NextResponse.redirect(url);
  }

  return response;
}
