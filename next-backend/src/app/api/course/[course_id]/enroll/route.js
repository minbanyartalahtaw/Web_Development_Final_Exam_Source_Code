//src/app/api/course/[course_id]/enroll/route.js

import { getCurrentUser, requireRole } from "@/lib/auth";
import {
  ROLE_STUDENT,
  STATUS_CANCEL,
  STATUS_OPEN,
} from "@/lib/constant";
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

/**
 * POST /api/course/:course_id/enroll  (Student only)
 * Enrolls only when status is Open, seats remain, and not already enrolled.
 * All three rules are in one atomic update so two students cannot
 * take the last seat at the same time.
 */
export async function POST(req, { params }) {
  try {
    const { course_id } = await params;
    const me = await getCurrentUser();
    const denied = requireRole(me, ROLE_STUDENT);
    if (denied) return denied;

    const _id = toObjectId(course_id);
    if (!_id) return errorResponse("Invalid course id", 400);
    const studentId = toObjectId(me.id);

    const col = await getCourseCollection();
    const updated = await col.findOneAndUpdate(
      {
        _id,
        status: STATUS_OPEN,
        "students.id": { $ne: studentId },
        $expr: { $lt: [{ $size: "$students" }, "$maxStudent"] },
      },
      {
        $push: {
          students: {
            id: studentId,
            username: me.username,
            email: me.email,
            enrolledAt: new Date(),
          },
        },
      },
      { returnDocument: "after" },
    );

    if (updated) {
      return successResponse(
        {
          message: "Enrolled successfully",
          course: toCourseResponse(updated, me),
        },
        200,
      );
    }

    // Work out which rule failed so the user gets a clear message
    const course = await col.findOne({ _id });
    if (!course || course.status === STATUS_CANCEL) {
      return errorResponse("Course not found", 404);
    }
    if (course.students.some((s) => s.id.equals(studentId))) {
      return errorResponse("You are already enrolled in this course", 409);
    }
    if (course.status !== STATUS_OPEN) {
      return errorResponse("This course is closed for enrollment", 400);
    }
    return errorResponse("This course is full", 400);
  } catch (error) {
    printExceptionLog("POST /api/course/[course_id]/enroll", error);
    return errorResponse("Failed to enroll", 500);
  }
}
