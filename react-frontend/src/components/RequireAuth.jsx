//src/components/RequireAuth.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// <RequireAuth> = any logged-in user, <RequireAuth role="Teacher"> = Teachers only
export default function RequireAuth({ role, children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
