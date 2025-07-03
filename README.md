![Image](https://github.com/user-attachments/assets/a39a0dff-7075-461e-a886-d53f14f38e76)
Chrono is a task management app built to help users track, plan, and organize their work. It supports recurring tasks, reminders, subtasks, and a calendar-based view to keep everything in sync. Chrono is built with React, Node.js, PostgreSQL, and Tailwind CSS.

Live at: [https://chrono.sameersharma.me](https://chrono.sameersharma.me)

## Features

* **Tasks with priority and filtering**
  The task list can be easily filtered by priority and tags, completion status, etc.

* **Reminders and Due Dates**
  Set a reminder time and a due date for each task. A background job triggers reminders via notifications or API hooks.

* **Calendar View**
  Visualize all tasks on a calendar. Dates show how many tasks are due or have reminders on that day.

* **Filters and Tags**
  Filter tasks by due date, status, or custom tags. Tags are user-specific and stored in the database.

* **Progress Tracking and Summaries**
  Weekly summaries show how many tasks were completed, skipped, or in progress on each day. A streak counter helps track consistency.

* **Theme Support**
  Fully responsive UI with support for dark and light themes. Theme preference is saved locally.

## Tech Stack

* **Frontend**: React, Tailwind CSS, React Router, Lucide Icons
* **Backend**: Express, PostgreSQL, Node.js
* **Auth**: JWT-based email/password auth with Google OAuth
* **Storage**: Supabase for image and file uploads
* **Scheduler**: Node-Cron for reminders
* **Other**: Chrome Extension API (for optional timer extension)

## Getting Started

### Prerequisites

* Node.js (v18 or later)
* PostgreSQL
* Supabase project (for storage and optional auth)
* Optional: Google OAuth credentials

### Backend

```bash
cd backend
npm install
```

Make a `.env` file at `backend/.env` and add:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
```

Then run:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Make a `.env` file at `frontend/.env` and add:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Then run:

```bash
npm run dev
```

## Folder Structure

```
chrono/
├── frontend/        # React app
├── backend/         # Express + PostgreSQL
└── README.md
```

## API Overview

Some key routes from the backend:

* `POST /api/auth/login` – Login user
* `POST /api/auth/register` – Register new user
* `GET /api/tasks` – Get all tasks
* `POST /api/tasks` – Create a new task
* `GET /api/tasks/range?date=YYYY-MM-DD` – Get tasks filtered by date
* `GET /api/calendar?start=...&end=...` – Get calendar task stats
* `POST /api/reminders/check` – Trigger reminders (called by cron job)

## Deployment

Chrono is designed to run with separate frontend and backend deployments. You can host it on Render, Vercel, or any platform that supports Node.js and PostgreSQL.

## License

Chrono is open source and available under the [MIT License](LICENSE).

---

If you're using or modifying Chrono, feel free to fork or contribute.
