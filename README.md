# Job Queue Application

A full-stack job queue management system featuring a React (Vite) frontend and a NestJS backend powered by Prisma and PostgreSQL.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** TailwindCSS 4
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library

### Backend
- **Framework:** NestJS 12
- **Database ORM:** Prisma 6
- **Database:** PostgreSQL (Neon)
- **Language:** TypeScript (ESM / NodeNext)
- **Testing:** Jest + Supertest

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v20 or higher recommended)
- A PostgreSQL database (can be hosted locally or on a service like Neon, Supabase, Render, etc.)

---

## ⚙️ Setup Instructions

### 1. Backend Setup

The backend handles the core API, database interactions, and job logic.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` folder and add your PostgreSQL connection URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   ```
4. Run database migrations to set up your schema:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

**Backend Scripts:**
- `npm run start:dev` - Starts the development server with hot-reload.
- `npm run build` - Builds the application into the `/dist` folder.
- `npm run test` - Runs unit tests.
- `npm run lint` - Runs oxlint for linting.

---

### 2. Frontend Setup

The frontend is a fast, responsive UI to view and manage your jobs.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `frontend` folder (this file is git-ignored by default). 
   ```env
   VITE_API_URL="http://localhost:3000" # Use this for local development
   # VITE_API_URL="https://job-queue-czy6.onrender.com" # Production URL
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

**Frontend Scripts:**
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles TypeScript and builds for production.
- `npm run test` - Runs tests via Vitest.
- `npm run lint` - Lints the codebase with ESLint.

---

## 🏗️ Architecture & Design Decisions

### Transition Rule Enforcement
The backend enforces strict rules for job status transitions (e.g., `pending` -> `running`, `running` -> `completed` | `failed`). 
- **Why backend-only?** State transitions must be validated at the source of truth to prevent inconsistent data from malicious requests, concurrent user actions, or frontend bugs. The frontend simply reflects these rules (e.g., by disabling buttons), but the backend actually guarantees the integrity of the database by rejecting invalid patches with a `409 Conflict`.

### Concurrency Approach
We use **Optimistic Locking** (via a `version` column in the database) to handle concurrent updates to a single job. 
- **How it works:** When a job is fetched, its current version is read. When an update is attempted, the database ensures the version matches what was read. If it does, the update succeeds and the version is incremented. If it doesn't match (meaning another process updated it in the meantime), a `409 Conflict` is thrown.
- **Why Optimistic over Row-Level (Pessimistic) Locking?** Optimistic locking is highly scalable for read-heavy or low-collision environments like this job queue. Pessimistic row-level locking (e.g., `SELECT ... FOR UPDATE`) holds active database locks which can block other transactions and reduce overall throughput, whereas optimistic locking operates completely lock-free until the exact moment of the atomic `UPDATE`.

---

### Assumptions & Trade-offs
- **No Authentication/Authorization:** The app assumes a single-tenant or open environment. Adding auth would require a more robust user model and session management.
- **In-Memory Status Counts (Frontend):** The frontend derives status counts from the locally fetched list of jobs. For very large datasets, the backend should ideally compute and return these aggregations via a dedicated endpoint to avoid transferring huge payloads.
- **Single-User Assumption:** Apart from the concurrency race condition handling (which we solved with optimistic locking), the UX doesn't explicitly display real-time updates via WebSockets, assuming standard polling/refreshing is sufficient for the scope.

### Bonus Feature
- **Status-Change Audit Log:** Implemented a backend audit log system to track historical status changes for every job. This provides a clear, reliable paper trail for debugging and auditing purposes, allowing us to see exactly when a job transitioned between `pending`, `running`, `completed`, or `failed` states.

---

## 📜 License
UNLICENSED
