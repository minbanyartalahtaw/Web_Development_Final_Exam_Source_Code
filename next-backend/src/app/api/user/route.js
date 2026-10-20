//src/app/api/user/route.js

import { getCurrentUser, requireRole } from "@/lib/auth";
import { DB_NAME, ROLES, ROLE_TEACHER } from "@/lib/constant";
import { getClientPromise } from "@/lib/mongodb";
import { toPublicUser } from "@/lib/user";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

// GET /api/user?role=Student|Teacher  -> list users (Teacher only, no passwords)
export async function GET(req) {
  try {
    const denied = requireRole(await getCurrentUser(), ROLE_TEACHER);
    if (denied) return denied;

    const role = req.nextUrl.searchParams.get("role");
    if (role && !ROLES.includes(role)) {
      return errorResponse(`role must be one of: ${ROLES.join(", ")}`, 400);
    }

    const client = await getClientPromise();
    const users = await client
      .db(DB_NAME)
      .collection("users")
      .find(role ? { role } : {})
      .sort({ role: 1, username: 1 })
      .toArray();

    return successResponse(users.map(toPublicUser), 200);
  } catch (error) {
    printExceptionLog("GET /api/user", error);
    return errorResponse("Failed to get users", 500);
  }
}
