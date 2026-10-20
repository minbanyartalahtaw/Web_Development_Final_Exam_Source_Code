//src/pages/student/StudentCourses.jsx

import { useContext, useEffect, useState } from "react";
import CourseTable from "../../components/CourseTable";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function StudentCourses() {
  const { apiFetch } = useContext(UserContext);
  const [courses, setCourses] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Search on the backend by course name or Teacher name (small debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = search.trim();
      apiFetch(`/api/course${q ? `?q=${encodeURIComponent(q)}` : ""}`)
        .then((data) => {
          setCourses(data);
          setError("");
        })
        .catch((err) => setError(err.message));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">All Courses</h1>
      <input
        className="mb-4 w-full max-w-md rounded border px-3 py-2"
        placeholder="Search by course name or teacher name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ErrorMessage message={error} />
      {courses ? (
        <CourseTable courses={courses} linkPrefix="/courses" showTeacher />
      ) : (
        !error && <p className="text-gray-500">Loading...</p>
      )}
    </Layout>
  );
}
