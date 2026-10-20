//src/pages/teacher/CourseEdit.jsx

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseForm from "../../components/CourseForm";
import ErrorMessage from "../../components/ErrorMessage";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function CourseEdit() {
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

  async function handleUpdate(data) {
    await apiFetch(`/api/course/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    navigate(`/teacher/courses/${id}`);
  }

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">Edit Course</h1>
      <ErrorMessage message={error} />
      {course && (
        <CourseForm
          initial={course}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      )}
    </Layout>
  );
}
