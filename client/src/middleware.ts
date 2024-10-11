import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  if (!token) return NextResponse.redirect(new URL("/root/login", req.url));

  if (req.nextUrl.pathname === "/login")  return NextResponse.redirect(req.nextUrl.basePath);
  return NextResponse.next();
}

export const config = {
  matcher: ["/root/new", "/root", "/root/draft/:page*"],
};
