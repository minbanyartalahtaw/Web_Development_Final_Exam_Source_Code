// scripts/seed-courses.mjs
// Creates sample courses + enrollments for testing.  Run with:  npm run seed:courses
// Requires the test users from `npm run seed`. Re-running replaces only the sample courses.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "wad_final";
if (!uri) {
  console.error("MONGODB_URI is not set (add it to .env)");
  process.exit(1);
}

const courses = [
  // teacher1
  { teacher: "teacher1", name: "React for Beginners", duration: 10, topics: ["JSX", "Components", "Props & State", "Hooks"], price: 2500, maxStudent: 30, status: "Open", students: ["student1", "student2"] },
  { teacher: "teacher1", name: "Advanced Node.js", duration: 14, topics: ["Event Loop", "Streams", "Express", "Testing"], price: 4500, maxStudent: 2, status: "Open", students: ["student1", "student2"] },
  { teacher: "teacher1", name: "HTML & CSS Basics", duration: 5, topics: ["HTML Elements", "Flexbox", "Grid", "Responsive Design"], price: 1200, maxStudent: 25, status: "Close", students: [] },
  // teacher2
  { teacher: "teacher2", name: "MongoDB Essentials", duration: 7, topics: ["Documents", "CRUD", "Indexes", "Aggregation"], price: 3000, maxStudent: 20, status: "Open", students: ["student1"] },
  { teacher: "teacher2", name: "Next.js Full Stack", duration: 21, topics: ["App Router", "API Routes", "Authentication", "Deployment"], price: 5500, maxStudent: 15, status: "Open", students: ["student3"] },
  { teacher: "teacher2", name: "PHP Legacy Systems", duration: 8, topics: ["Syntax", "Sessions", "MySQL"], price: 1500, maxStudent: 10, status: "Cancel", students: [] },
  // teacher3
  { teacher: "teacher3", name: "Python for Data Science", duration: 12, topics: ["Pandas", "NumPy", "Matplotlib", "Data Cleaning"], price: 3500, maxStudent: 1, status: "Open", students: ["student1"] },
  { teacher: "teacher3", name: "UX/UI Design Fundamentals", duration: 6, topics: ["User Research", "Wireframing", "Figma", "Prototyping"], price: 2000, maxStudent: 20, status: "Close", students: [] },
  { teacher: "teacher3", name: "Git & GitHub Workflow", duration: 3, topics: ["Commits", "Branching", "Pull Requests"], price: 0, maxStudent: 50, status: "Open", students: [] },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);

  const users = await db.collection("users").find().toArray();
  const byName = Object.fromEntries(users.map((u) => [u.username, u]));
  const missing = [...new Set(courses.flatMap((c) => [c.teacher, ...c.students]))].filter((n) => !byName[n]);
  if (missing.length) {
    console.error(`Missing users: ${missing.join(", ")} – run "npm run seed" first`);
    process.exit(1);
  }

  const col = db.collection("courses");
  const removed = await col.deleteMany({ sample: true });

  const now = new Date();
  await col.insertMany(
    courses.map(({ teacher, students, ...c }) => ({
      ...c,
      teacherId: byName[teacher]._id,
      teacherName: teacher,
      students: students.map((s) => ({
        id: byName[s]._id,
        username: s,
        email: byName[s].email,
        enrolledAt: now,
      })),
      sample: true,
      createdAt: now,
    })),
  );

  for (const c of courses) {
    console.log(`  ${c.teacher}  ${c.status.padEnd(6)} ${String(c.students.length).padStart(2)}/${String(c.maxStudent).padEnd(2)}  ${c.name}`);
  }
  console.log(`Replaced ${removed.deletedCount} old sample courses, inserted ${courses.length} into "${dbName}.courses"`);
} finally {
  await client.close();
}
