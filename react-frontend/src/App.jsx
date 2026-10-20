//src/App.jsx

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyCourses from "./pages/student/MyCourses";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import StudentCourses from "./pages/student/StudentCourses";
import CourseCreate from "./pages/teacher/CourseCreate";
import CourseEdit from "./pages/teacher/CourseEdit";
import TeacherCourseDetail from "./pages/teacher/TeacherCourseDetail";
import TeacherCourses from "./pages/teacher/TeacherCourses";

const teacher = (page) => <RequireAuth role="Teacher">{page}</RequireAuth>;
const student = (page) => <RequireAuth role="Student">{page}</RequireAuth>;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        {/* Teacher */}
        <Route path="/teacher/courses" element={teacher(<TeacherCourses />)} />
        <Route path="/teacher/courses/new" element={teacher(<CourseCreate />)} />
        <Route
          path="/teacher/courses/:id"
          element={teacher(<TeacherCourseDetail />)}
        />
        <Route
          path="/teacher/courses/:id/edit"
          element={teacher(<CourseEdit />)}
        />

        {/* Student */}
        <Route path="/courses" element={student(<StudentCourses />)} />
        <Route path="/courses/:id" element={student(<StudentCourseDetail />)} />
        <Route path="/my-courses" element={student(<MyCourses />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
