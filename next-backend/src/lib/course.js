// src/lib/course.js

import { ObjectId } from "mongodb";
import { COURSE_STATUSES, DB_NAME, ROLE_TEACHER } from "./constant";
import { getClientPromise } from "./mongodb";

export async function getCourseCollection() {
  const client = await getClientPromise();
  return client.db(DB_NAME).collection("courses");
}

export function toObjectId(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// Escape user text before using it inside a RegExp (for the search filter)
export function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isPositiveInt(v) {
  return Number.isInteger(v) && v > 0;
}

/**
 * Validates the course fields from a request body.
 * Returns { errors: [...] } or { data: {...} } with cleaned values.
 */
export function validateCourse(body) {
  const errors = [];
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const duration = Number(body.duration);
  const price = Number(body.price);
  const maxStudent = Number(body.maxStudent);
  const status = body.status;
  const topics = Array.isArray(body.topics)
    ? body.topics
        .filter((t) => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  if (!name) errors.push("Course name is required");
  if (!isPositiveInt(duration))
    errors.push("Duration must be a positive whole number of days");
  if (topics.length === 0) errors.push("At least one topic is required");
  if (body.price === "" || !Number.isFinite(price) || price < 0)
    errors.push("Price must be 0 or more");
  if (!isPositiveInt(maxStudent))
    errors.push("Max Student must be a positive whole number");
  if (!COURSE_STATUSES.includes(status))
    errors.push(`Status must be one of: ${COURSE_STATUSES.join(", ")}`);

  if (errors.length) return { errors };
  return { data: { name, duration, topics, price, maxStudent, status } };
}

/**
 * Shapes a course document for the response.
 * Only the owning Teacher sees the enrolled student list.
 */
export function toCourseResponse(course, viewer) {
  const students = course.students ?? [];
  const result = {
    id: course._id.toString(),
    name: course.name,
    duration: course.duration,
    topics: course.topics,
    price: course.price,
    maxStudent: course.maxStudent,
    status: course.status,
    teacherId: course.teacherId.toString(),
    teacherName: course.teacherName,
    enrolledCount: students.length,
    seatsLeft: Math.max(course.maxStudent - students.length, 0),
  };

  if (viewer.role === ROLE_TEACHER) {
    result.students = students.map((s) => ({
      id: s.id.toString(),
      username: s.username,
      email: s.email,
      enrolledAt: s.enrolledAt,
    }));
  } else {
    result.isEnrolled = students.some((s) => s.id.toString() === viewer.id);
  }
  return result;
}
