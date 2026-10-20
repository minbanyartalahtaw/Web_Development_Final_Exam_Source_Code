//src/app/api/course/enrolled/route.js

import { getCurrentUser, requireRole } from "@/lib/auth";
import { ROLE_STUDENT } from "@/lib/constant";
import corsHeaders from "@/lib/cors";
import {
  getCourseCollection,
  toCourseResponse,
  toObjectId,
} from "@/lib/course";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// GET /api/course/enrolled  -> courses the current Student is enrolled in
export async function GET() {
  try {
    const me = await getCurrentUser();
    const denied = requireRole(me, ROLE_STUDENT);
    if (denied) return denied;

    const courses = await (await getCourseCollection())
      .find({ "students.id": toObjectId(me.id) })
      .sort({ _id: -1 })
      .toArray();

    return successResponse(
      courses.map((c) => toCourseResponse(c, me)),
      200,
    );
  } catch (error) {
    printExceptionLog("GET /api/course/enrolled", error);
    return errorResponse("Failed to get enrolled courses", 500);
  }
}
