//src/components/CourseInfo.jsx

import StatusBadge from "./StatusBadge";

// Course detail fields, shared by Teacher and Student detail pages
export default function CourseInfo({ course }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{course.name}</h1>
        <StatusBadge status={course.status} />
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-gray-500">Teacher</dt>
          <dd>{course.teacherName}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Duration</dt>
          <dd>{course.duration} days</dd>
        </div>
        <div>
          <dt className="text-gray-500">Price</dt>
          <dd>{course.price.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Enrolled</dt>
          <dd>
            {course.enrolledCount} / {course.maxStudent}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Seats left</dt>
          <dd>{course.seatsLeft}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Topics</p>
        <ul className="mt-1 list-inside list-disc text-sm">
          {course.topics.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
