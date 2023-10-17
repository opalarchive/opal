import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname);
  return NextResponse.next();
}
