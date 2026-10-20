//src/app/api/course/[course_id]/route.js

import { getCurrentUser, requireRole } from "@/lib/auth";
import { ROLE_TEACHER, STATUS_CANCEL } from "@/lib/constant";
import corsHeaders from "@/lib/cors";
import {
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
 * GET /api/course/:course_id
 *  - Teacher: only their own course, including enrolled students
 *  - Student: any course that is not Cancel
 */
export async function GET(req, { params }) {
  try {
    const { course_id } = await params;
    const me = await getCurrentUser();
    const _id = toObjectId(course_id);
    if (!_id) return errorResponse("Invalid course id", 400);

    const course = await (await getCourseCollection()).findOne({ _id });
    if (!course) return errorResponse("Course not found", 404);

    if (me.role === ROLE_TEACHER) {
      if (course.teacherId.toString() !== me.id) {
        return errorResponse("Forbidden: not your course", 403);
      }
    } else if (course.status === STATUS_CANCEL) {
      return errorResponse("Course not found", 404);
    }

    return successResponse(toCourseResponse(course, me), 200);
  } catch (error) {
    printExceptionLog("GET /api/course/[course_id]", error);
    return errorResponse("Failed to get course", 500);
  }
}

// PUT /api/course/:course_id  -> update own course (Teacher only)
export async function PUT(req, { params }) {
  try {
    const { course_id } = await params;
    const me = await getCurrentUser();
    const denied = requireRole(me, ROLE_TEACHER);
    if (denied) return denied;

    const _id = toObjectId(course_id);
    if (!_id) return errorResponse("Invalid course id", 400);

    const body = await req.json().catch(() => ({}));
    const { errors, data } = validateCourse(body);
    if (errors) return errorResponse(errors.join(", "), 400);

    const col = await getCourseCollection();
    const course = await col.findOne({ _id });
    if (!course) return errorResponse("Course not found", 404);
    if (course.teacherId.toString() !== me.id) {
      return errorResponse("Forbidden: not your course", 403);
    }

    // Max Student cannot go below the number already enrolled.
    // Checked inside the update filter so it is safe against concurrent enrollments.
    const updated = await col.findOneAndUpdate(
      {
        _id,
        teacherId: course.teacherId,
        $expr: { $lte: [{ $size: "$students" }, data.maxStudent] },
      },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!updated) {
      return errorResponse(
        "Max Student cannot be less than the number of enrolled students",
        400,
      );
    }

    return successResponse(toCourseResponse(updated, me), 200);
  } catch (error) {
    printExceptionLog("PUT /api/course/[course_id]", error);
    return errorResponse("Failed to update course", 500);
  }
}

// DELETE /api/course/:course_id  -> delete own course only when nobody enrolled
export async function DELETE(req, { params }) {
  try {
    const { course_id } = await params;
    const me = await getCurrentUser();
    const denied = requireRole(me, ROLE_TEACHER);
    if (denied) return denied;

    const _id = toObjectId(course_id);
    if (!_id) return errorResponse("Invalid course id", 400);

    const col = await getCourseCollection();
    const course = await col.findOne({ _id });
    if (!course) return errorResponse("Course not found", 404);
    if (course.teacherId.toString() !== me.id) {
      return errorResponse("Forbidden: not your course", 403);
    }

    // Only delete if the students array is still empty (atomic check)
    const result = await col.deleteOne({
      _id,
      teacherId: course.teacherId,
      "students.0": { $exists: false },
    });
    if (result.deletedCount === 0) {
      return errorResponse(
        "Cannot delete a course that has enrolled students",
        400,
      );
    }

    return successResponse({ message: "Course deleted" }, 200);
  } catch (error) {
    printExceptionLog("DELETE /api/course/[course_id]", error);
    return errorResponse("Failed to delete course", 500);
  }
}
