# How to Test the App

## Student Information

- **Student Name :** Min Banyar Tala Htaw
- **Student ID :** 6715168

## Test Credentials

All test users share the password **`password123`**. You can log in with either the username or the email.

| Role    | Username   | Email                  | Password      |
| ------- | ---------- | ---------------------- | ------------- |
| Teacher | `teacher1` | `teacher1@example.com` | `password123` |
| Teacher | `teacher2` | `teacher2@example.com` | `password123` |
| Teacher | `teacher3` | `teacher3@example.com` | `password123` |
| Student | `student1` | `student1@example.com` | `password123` |
| Student | `student2` | `student2@example.com` | `password123` |
| Student | `student3` | `student3@example.com` | `password123` |

## Prerequisites

- Node.js 22+ and npm
- A MongoDB database (e.g. MongoDB Atlas)

## How to Run & Test

### 1. Backend Setup (`next-backend/`)

- `cd next-backend && npm install`
- Copy `.env.example` to `.env` and set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET` (and `FRONTEND_URL` for production).
- `npm run seed` – creates the 3 Teacher and 3 Student test users above.
- `npm run dev` – API runs at http://localhost:3000

### 2. Frontend Setup (`react-frontend/`)

- `cd react-frontend && npm install`
- Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:3000`
- `npm run dev` – app runs at http://localhost:5173

### 3. Testing Walkthrough

**Authentication**

- Open the app; you are redirected to the login page when not logged in.
- Log in with any test user (username or email). The navbar shows the username and role.
- Click **Logout** to end the session.

**Teacher** (log in as `teacher1`)

1. **My Courses** lists only the courses created by this teacher.
2. Click **+ New Course**, fill in name, duration, topics (add several with **+ Add topic**), price, max student and status, then **Create Course**.
3. Click a course name to see its details and the **Enrolled Students** table.
4. Click **Edit** to update the course (Max Student cannot be set below the number already enrolled).
5. **Delete** works only while no student is enrolled.
6. Log in as `teacher2`: courses of `teacher1` are not listed and cannot be opened or edited (403 from the API).

**Student** (log in as `student1`)

1. **All Courses** lists every course except those with status _Cancel_.
2. Type in the search box to filter by part of the course name or teacher name (e.g. `teacher1`).
3. Click a course to see its details, then **Enroll**.
   - Enrolling is only allowed when the status is _Open_ and seats remain (Max Student).
   - Enrolling twice in the same course is rejected.
   - _Close_ courses are visible but cannot be enrolled in.
4. **My Enrollments** lists the courses this student is enrolled in.
5. Log back in as the teacher to see the student in the course's **Enrolled Students** table.
