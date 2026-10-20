//src/pages/teacher/CourseCreate.jsx

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "../../components/CourseForm";
import Layout from "../../components/Layout";
import { UserContext } from "../../context/UserContext";

export default function CourseCreate() {
  const { apiFetch } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleCreate(course) {
    const created = await apiFetch("/api/course", {
      method: "POST",
      body: JSON.stringify(course),
    });
    navigate(`/teacher/courses/${created.id}`);
  }

  return (
    <Layout>
      <h1 className="mb-4 text-2xl font-semibold">New Course</h1>
      <CourseForm submitLabel="Create Course" onSubmit={handleCreate} />
    </Layout>
  );
}
