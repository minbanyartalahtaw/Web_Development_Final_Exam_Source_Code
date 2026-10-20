//src/pages/teacher/TeacherCourses.jsx

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseTable from "../../components/CourseTable";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function TeacherCourses() {
  const { apiFetch } = useContext(UserContext);
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/course")
      .then(setCourses)
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Courses</h1>
        <Link
          to="/teacher/courses/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New Course
        </Link>
      </div>
      <ErrorMessage message={error} />
      {courses ? (
        <CourseTable courses={courses} linkPrefix="/teacher/courses" />
      ) : (
        !error && <p className="text-gray-500">Loading...</p>
      )}
    </Layout>
  );
}
