//src/app/api/auth/me/route.js

import { getCurrentUser } from "@/lib/auth";
import { successResponse } from "@/lib/utils";

// GET /api/auth/me  -> current logged-in user (token checked by proxy.js)
export async function GET() {
  return successResponse({ user: await getCurrentUser() }, 200);
}
