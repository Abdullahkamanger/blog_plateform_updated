import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function proxy(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  const url = new URL(request.url);

  // Protect Admin routes
  if (url.pathname.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Editor routes
  if (url.pathname.startsWith("/editor")) {
    if (
      !session ||
      (role !== "ADMIN" && role !== "EDITOR")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*"],
};