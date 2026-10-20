//src/pages/teacher/TeacherCourseDetail.jsx

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CourseInfo from "../../components/CourseInfo";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function TeacherCourseDetail() {
  const { id } = useParams();
  const { apiFetch } = useContext(UserContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(`/api/course/${id}`)
      .then(setCourse)
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${course.name}"?`)) return;
    setError("");
    try {
      await apiFetch(`/api/course/${id}`, { method: "DELETE" });
      navigate("/teacher/courses");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <Link to="/teacher/courses" className="text-sm text-blue-600 hover:underline">
        &larr; Back to my courses
      </Link>
      <div className="mt-3">
        <ErrorMessage message={error} />
      </div>

      {course && (
        <>
          <CourseInfo course={course} />

          <div className="mt-4 flex gap-2">
            <Link
              to={`/teacher/courses/${id}/edit`}
              className="rounded border bg-white px-4 py-2 text-sm hover:bg-gray-100"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={course.enrolledCount > 0}
              title={
                course.enrolledCount > 0
                  ? "Cannot delete a course with enrolled students"
                  : ""
              }
              className="rounded border border-red-300 bg-white px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete
            </button>
          </div>

          <h2 className="mt-8 mb-2 text-lg font-semibold">
            Enrolled Students ({course.students.length})
          </h2>
          {course.students.length === 0 ? (
            <p className="text-gray-500">No students enrolled yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {course.students.map((s, i) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{s.username}</td>
                      <td className="px-4 py-2">{s.email}</td>
                      <td className="px-4 py-2">
                        {new Date(s.enrolledAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
