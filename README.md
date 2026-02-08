# HRMS Lite

HRMS Lite is a lightweight Human Resource Management System designed to manage employee records and track daily attendance. The application focuses on clean UI, stable backend APIs, proper validations, and production-ready deployment practices.

---

## 🚀 Project Overview

HRMS Lite allows an admin to:
- Manage employee records (add, list, delete)
- Mark daily attendance (Present / Absent)
- View attendance history with date filters
- View dashboard summary (total employees, present today, absent today)

The system is designed as a **single-admin internal HR tool** with a simple and professional interface.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy ORM
- Pydantic

### Database
- MySQL (TiDB in production)

### DevOps / Deployment
- Docker & Docker Compose (local)
- Render (frontend & backend deployment)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DB_NAME
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

⚠️ **Note:** Create `.env` files using the above provided example and replace values with your own.

---

## 📦 Running the Project Locally

You can run the project in two ways:

### 🐳 Option 1: Run using Docker

This starts MySQL + Backend + Frontend together.

**Prerequisites:**
- Docker
- Docker Compose

**Steps:**

From the project root:
```bash
docker compose up --build
```

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- MySQL: localhost:3306

This is the easiest way to run the entire stack locally.

---

### 🧑‍💻 Option 2: Run without Docker (Manual Setup)

#### Step 1: Setup MySQL
1. Start a local MySQL server
2. Create a database
3. Generate a MySQL connection string

Example:
```
mysql+pymysql://user:password@localhost:3306/hrms_db
```

Add this to `backend/.env`:
```env
DATABASE_URL=your_connection_string
FRONTEND_URL=http://localhost:3000
```

#### Step 2: Run Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on: http://localhost:8000

#### Step 3: Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

Update `frontend/.env` if needed:
```env
VITE_API_URL=http://localhost:8000
```

---

## ✅ Deployment

- Frontend and Backend are deployed on **Render**
- Database is hosted on **TiDB**
- Docker images are used for production builds
- Frontend communicates with backend via environment-based API URLs

---
