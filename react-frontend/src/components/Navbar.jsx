//src/components/Navbar.jsx

import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const linkClass = ({ isActive }) =>
  isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-black";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="font-semibold">Online Course Service</span>
        {user?.role === "Teacher" && (
          <NavLink to="/teacher/courses" className={linkClass}>
            My Courses
          </NavLink>
        )}
        {user?.role === "Student" && (
          <>
            <NavLink to="/courses" end className={linkClass}>
              All Courses
            </NavLink>
            <NavLink to="/my-courses" className={linkClass}>
              My Enrollments
            </NavLink>
          </>
        )}
      </div>
      {user && (
        <div className="flex items-center gap-4 text-sm">
          <span>
            {user.username} <span className="text-gray-500">({user.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="rounded border px-3 py-1 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
