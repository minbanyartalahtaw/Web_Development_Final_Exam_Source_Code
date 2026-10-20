// scripts/seed-users.mjs
// Creates/updates the test users.  Run with:  npm run seed

import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "wad_final";
if (!uri) {
  console.error("MONGODB_URI is not set (add it to .env)");
  process.exit(1);
}

const PASSWORD = "password123";

const users = [
  { username: "teacher1", email: "teacher1@example.com", role: "Teacher" },
  { username: "teacher2", email: "teacher2@example.com", role: "Teacher" },
  { username: "teacher3", email: "teacher3@example.com", role: "Teacher" },
  { username: "student1", email: "student1@example.com", role: "Student" },
  { username: "student2", email: "student2@example.com", role: "Student" },
  { username: "student3", email: "student3@example.com", role: "Student" },
];

const client = new MongoClient(uri);
try {
  await client.connect();
  const col = client.db(dbName).collection("users");

  await col.createIndex({ username: 1 }, { unique: true });
  await col.createIndex({ email: 1 }, { unique: true });

  const hash = await bcrypt.hash(PASSWORD, 10);
  for (const u of users) {
    await col.updateOne(
      { username: u.username },
      { $set: { ...u, password: hash } },
      { upsert: true },
    );
    console.log(`  ${u.role.padEnd(7)} ${u.username} / ${PASSWORD}`);
  }
  console.log(`Seeded ${users.length} users into "${dbName}.users"`);
} finally {
  await client.close();
}
