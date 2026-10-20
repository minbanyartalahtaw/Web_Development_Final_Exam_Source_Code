//src/components/CourseTable.jsx

import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

// Simple course list table; linkPrefix decides where a row links to
export default function CourseTable({ courses, linkPrefix, showTeacher }) {
  if (courses.length === 0) {
    return <p className="text-gray-500">No courses found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-2">Course</th>
            {showTeacher && <th className="px-4 py-2">Teacher</th>}
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Enrolled</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link
                  to={`${linkPrefix}/${c.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.name}
                </Link>
              </td>
              {showTeacher && <td className="px-4 py-2">{c.teacherName}</td>}
              <td className="px-4 py-2">{c.duration} days</td>
              <td className="px-4 py-2">{c.price.toLocaleString()}</td>
              <td className="px-4 py-2">
                {c.enrolledCount} / {c.maxStudent}
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={c.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
