//src/pages/student/MyCourses.jsx

import { useContext, useEffect, useState } from "react";
import CourseTable from "../../components/CourseTable";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function MyCourses() {
  const { apiFetch } = useContext(UserContext);
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/course/enrolled")
      .then(setCourses)
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">My Enrollments</h1>
      <ErrorMessage message={error} />
      {courses ? (
        <CourseTable courses={courses} linkPrefix="/courses" showTeacher />
      ) : (
        !error && <p className="text-gray-500">Loading...</p>
      )}
    </Layout>
  );
}
