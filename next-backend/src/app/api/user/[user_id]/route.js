//src/app/api/user/[user_id]/route.js

import { ObjectId } from "mongodb";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { DB_NAME, ROLE_TEACHER } from "@/lib/constant";
import { getClientPromise } from "@/lib/mongodb";
import { toPublicUser } from "@/lib/user";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

// GET /api/user/:user_id  -> a user's public info (yourself, or anyone if Teacher)
export async function GET(req, { params }) {
  try {
    const { user_id } = await params;
    const me = await getCurrentUser();

    if (user_id !== me.id) {
      const denied = requireRole(me, ROLE_TEACHER);
      if (denied) return denied;
    }
    if (!ObjectId.isValid(user_id)) {
      return errorResponse("Invalid user id", 400);
    }

    const client = await getClientPromise();
    const user = await client
      .db(DB_NAME)
      .collection("users")
      .findOne({ _id: new ObjectId(user_id) });

    if (!user) {
      return errorResponse("User not found", 404);
    }
    return successResponse(toPublicUser(user), 200);
  } catch (error) {
    printExceptionLog("GET /api/user/[user_id]", error);
    return errorResponse("Failed to get user", 500);
  }
}
