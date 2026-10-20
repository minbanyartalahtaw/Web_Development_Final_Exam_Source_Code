//src/app/api/course/route.js

import { getCurrentUser, requireRole } from "@/lib/auth";
import {
  ROLE_TEACHER,
  STATUS_CANCEL,
} from "@/lib/constant";
import corsHeaders from "@/lib/cors";
import {
  escapeRegex,
  getCourseCollection,
  toCourseResponse,
  toObjectId,
  validateCourse,
} from "@/lib/course";
import {
  errorResponse,
  printExceptionLog,
  successResponse,
} from "@/lib/utils";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

/**
 * GET /api/course?q=text
 *  - Teacher: only their own courses (all statuses)
 *  - Student: all courses except Cancel, optional filter by
 *             part of the course name or Teacher name
 */
export async function GET(req) {
  try {
    const me = await getCurrentUser();
    const q = req.nextUrl.searchParams.get("q")?.trim();

    const filter = {};
    if (me.role === ROLE_TEACHER) {
      filter.teacherId = toObjectId(me.id);
    } else {
      filter.status = { $ne: STATUS_CANCEL };
    }
    if (q) {
      const regex = { $regex: escapeRegex(q), $options: "i" };
      filter.$or = [{ name: regex }, { teacherName: regex }];
    }

    const courses = await (await getCourseCollection())
      .find(filter)
      .sort({ _id: -1 })
      .toArray();

    return successResponse(
      courses.map((c) => toCourseResponse(c, me)),
      200,
    );
  } catch (error) {
    printExceptionLog("GET /api/course", error);
    return errorResponse("Failed to get courses", 500);
  }
}

// POST /api/course  -> create a course (Teacher only)
export async function POST(req) {
  try {
    const me = await getCurrentUser();
    const denied = requireRole(me, ROLE_TEACHER);
    if (denied) return denied;

    const body = await req.json().catch(() => ({}));
    const { errors, data } = validateCourse(body);
    if (errors) return errorResponse(errors.join(", "), 400);

    const course = {
      ...data,
      teacherId: toObjectId(me.id),
      teacherName: me.username,
      students: [],
      createdAt: new Date(),
    };
    const result = await (await getCourseCollection()).insertOne(course);

    return successResponse(
      toCourseResponse({ ...course, _id: result.insertedId }, me),
      201,
    );
  } catch (error) {
    printExceptionLog("POST /api/course", error);
    return errorResponse("Failed to create course", 500);
  }
}
