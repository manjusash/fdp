# FDP Admin Portal

React + Node.js + MySQL student registration portal.

## Project Structure
```
fdp/
├── backend/          ← Express + MySQL API
│   ├── server.js
│   ├── db.js
│   ├── .env
│   ├── setup.sql     ← Run this in MySQL first
│   └── package.json
└── frontend/         ← React App
    ├── src/
    │   ├── App.js
    │   ├── Login.js
    │   └── Dashboard.js
    └── package.json
```

## STEP 1 — Setup MySQL Database

Open MySQL Workbench (or CLI) and run:
```sql
-- Copy contents of backend/setup.sql and run it
```
This creates the `fdp_db` database, `admins` and `students` tables,
and inserts the default admin account.

**Default login:** username: `admin` | password: `admin123`

## STEP 2 — Configure Backend

Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD   ← change this!
DB_NAME=fdp_db
JWT_SECRET=fdp_super_secret_key_2024
PORT=5000
```

## STEP 3 — Install & Run Backend

```powershell
cd D:\fdp\backend
npm install
npm start
```
You should see: ✅ Server running on http://localhost:5000

## STEP 4 — Install & Run Frontend

Open a NEW terminal:
```powershell
cd D:\fdp\frontend
npm install
npm start
```
Browser opens at http://localhost:3000

## Features
- 🔐 Secure admin login with JWT tokens
- 📋 Add students (name, Moodle ID, course)
- 🗄️ Data saved to MySQL instantly
- 📊 Live table shows all records from DB
- 🗑️ Delete students
- 📈 Stats dashboard (total students, courses)

## API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/login | Admin login |
| GET | /api/students | Get all students |
| POST | /api/students | Add student |
| DELETE | /api/students/:id | Delete student |
