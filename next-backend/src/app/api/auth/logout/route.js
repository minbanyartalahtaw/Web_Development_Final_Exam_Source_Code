//src/app/api/auth/logout/route.js

import { tokenCookieOptions } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { TOKEN_COOKIE } from "@/lib/constant";
import { successResponse } from "@/lib/utils";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// POST /api/auth/logout  -> clears the token cookie
export async function POST() {
  const response = successResponse({ message: "Logout successful" }, 200);
  response.cookies.set(TOKEN_COOKIE, "", tokenCookieOptions(0));
  return response;
}
