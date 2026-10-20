//src/pages/Home.jsx

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// Send each role to its own start page
export default function Home() {
  const { user } = useContext(UserContext);
  return (
    <Navigate
      to={user.role === "Teacher" ? "/teacher/courses" : "/courses"}
      replace
    />
  );
}
