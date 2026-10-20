//src/pages/student/StudentCourseDetail.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CourseInfo from "../../components/CourseInfo";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function StudentCourseDetail() {
  const { id } = useParams();
  const { apiFetch } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    apiFetch(`/api/course/${id}`)
      .then(setCourse)
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleEnroll() {
    setError("");
    setMessage("");
    setEnrolling(true);
    try {
      const data = await apiFetch(`/api/course/${id}/enroll`, {
        method: "POST",
      });
      setCourse(data.course);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  }

  // Why the Enroll button is disabled (the backend enforces the same rules)
  let blockedReason = "";
  if (course) {
    if (course.isEnrolled) blockedReason = "You are enrolled in this course.";
    else if (course.status !== "Open")
      blockedReason = "This course is closed for enrollment.";
    else if (course.seatsLeft <= 0) blockedReason = "This course is full.";
  }

  return (
    <Layout>
      <Link to="/courses" className="text-sm text-blue-600 hover:underline">
        &larr; Back to all courses
      </Link>
      <div className="mt-3">
        <ErrorMessage message={error} />
        {message && (
          <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        )}
      </div>

      {course && (
        <>
          <CourseInfo course={course} />
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleEnroll}
              disabled={!!blockedReason || enrolling}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
            {blockedReason && (
              <span className="text-sm text-gray-600">{blockedReason}</span>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
