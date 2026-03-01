# SQL Playground

An interactive SQL learning platform where students can practice writing SQL queries against real databases, get AI-powered hints, and track their progress.

**Live Demo:** [sql-playground-eta.vercel.app](https://sql-playground-eta.vercel.app)

---

## What it does

- Students sign up and get access to a set of SQL assignments
- Each assignment has a question, sample tables with seed data, and an expected output
- Students write SQL queries in an editor and submit them
- The platform executes the query in an isolated sandbox, compares the result with the expected output, and returns a verdict
- If stuck, students can request an AI-generated hint powered by Gemini
- Submission history is tracked per user per assignment

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React JS + SCSS |
| Backend | Node.js + Express |
| Primary Database | MongoDB Atlas |
| Query Sandbox | Neon PostgreSQL |
| AI Hints | Google Gemini API |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Architecture

### High Level

```
User → React App (Vercel) → Express API (Render) → MongoDB Atlas
                                                  → Neon PostgreSQL
                                                  → Gemini AI
```

### Database Strategy

- **MongoDB** stores all persistent data — users, assignments, submissions, progress
- **PostgreSQL** is used only for query execution — each user gets an isolated schema per assignment
- Every query runs inside a `BEGIN / ROLLBACK` transaction so data always resets after execution

### Per-User Schema Isolation

When a user opens an assignment:
1. A schema named `user_{userId}_{assignmentId}` is created in PostgreSQL
2. Tables are created and seed data is inserted
3. Student queries run inside this schema in a transaction that always rolls back
4. A background cron job drops schemas that have been idle for more than 1 hour

---

## Project Structure

```
/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── postgres.js        # PostgreSQL pool
│   ├── models/
│   │   ├── user.model.js
│   │   ├── assignment.model.js
│   │   ├── submission.model.js
│   │   ├── userProgress.model.js
│   │   └── activeSchema.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── assignment.routes.js
│   │   └── submission.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── assignment.controller.js
│   │   ├── submission.controller.js
│   │   └── hint.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── services/
│   │   ├── submission.service.js
│   │   ├── hint.service.js
│   │   └── cleanup.service.js
│   ├── validators/
│   │   └── auth.validator.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Assignments.jsx
        │   └── Assignment.jsx
        ├── components/
        │   ├── QueryEditor.jsx
        │   ├── ActionBar.jsx
        │   ├── ResultBox.jsx
        │   ├── HintBox.jsx
        │   ├── SampleDataViewer.jsx
        │   └── SubmissionHistory.jsx
        ├── styles/
        │   ├── main.scss
        │   ├── _variables.scss
        │   ├── _mixins.scss
        │   ├── _reset.scss
        │   ├── _buttons.scss
        │   └── components/
        │       ├── _auth.scss
        │       ├── _assignments.scss
        │       └── _assignment.scss
        ├── api/
        │   └── axios.js
        ├── App.jsx
        └── main.jsx
```

---

## API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login with username or email |

### Assignments
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/assignment` | Get all assignments with user status |
| GET | `/assignment/:id` | Get assignment details, initiates per-user PostgreSQL schema |
| GET | `/assignment/:id/hint` | Get AI hint for the assignment |

### Submissions
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/submission/:id` | Submit a query, returns verdict and result rows |

All assignment and submission routes are protected by JWT middleware.

---

## How Submission Works

1. Student submits a SQL query
2. Backend sets `search_path` to the user's schema
3. Query runs inside a `BEGIN / ROLLBACK` transaction
4. Result rows are returned and the transaction always rolls back
5. Result is compared with expected output after:
   - Normalizing data types (Postgres returns numbers as strings)
   - Sorting both result sets to handle non-deterministic ordering
6. Verdict (`correct` / `wrong` / `error`) is saved to MongoDB
7. User progress is updated

---

## Running Locally

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_atlas_url
POSTGRES_URL=your_neon_postgres_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=3h
GEMINI_API=your_gemini_api_key
CLIENT_URL=http://localhost:5173
PORT=5003
```

```bash
node server.js
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5003
```

```bash
npm run dev
```

---

## Technical Challenges

- **Per-user schema isolation** — managing isolated PostgreSQL schemas per user per assignment with automatic cleanup
- **Transaction rollback** — ensuring student queries never permanently modify sandbox data
- **Result comparison** — normalizing data types and sorting results for order-independent comparison
- **Neon connection timeouts** — handling serverless PostgreSQL that pauses after inactivity
- **CORS configuration** — managing origins across local and production environments

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `POSTGRES_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRY` | JWT expiry duration (e.g. 3h) |
| `GEMINI_API` | Google Gemini API key |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
