# 🛡️ ProctorShield — Online Proctoring System

A secure online exam proctoring platform built with **Node.js + Express** showcasing **4 different database paradigms** working together.

## 🗄️ Database Architecture

| Database | Type | Usage |
|---|---|---|
| **PostgreSQL** | Relational | Users, courses, exams, questions, submissions (ACID transactions) |
| **Redis** | In-Memory | Sessions, live exam timers, violation counters, auto-save |
| **CouchDB** | Document | Proctoring event logs, exam reports (flexible JSON documents) |
| **Neo4j** | Graph | Student-course relationships, collusion/cheating detection |

## ✨ Features

- **Student & Instructor roles** with JWT + Redis session auth
- **Course management** with enrollment
- **Exam creation** with MCQ question banks
- **Real-time proctoring**: tab switch detection, fullscreen enforcement, webcam monitoring
- **Live monitoring dashboard** for instructors
- **Proctoring reports** stored in CouchDB
- **Collusion detection** via Neo4j graph analysis
- **Auto-save** answers to Redis during exams

## 🚀 Setup

### Prerequisites
- Node.js 18+
- PostgreSQL (port 5432)
- Redis (port 6379)
- CouchDB (port 5984)
- Neo4j (port 7687)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Databases
Edit `.env` file with your database credentials.

### 3. Create PostgreSQL Database
```sql
CREATE DATABASE proctorshield;
```

### 4. Seed Sample Data
```bash
npm run seed
```

### 5. Start the Server
```bash
npm run dev
```

Visit **http://localhost:3000**

### Demo Credentials
- **Instructor**: sarah@university.edu / password123
- **Student**: alice@student.edu / password123
- **Student**: bob@student.edu / password123

## 📁 Project Structure

```
├── server.js              # Express entry point
├── config/                # Database connections
│   ├── postgres.js        # PostgreSQL pool
│   ├── redis.js           # Redis client
│   ├── couchdb.js         # CouchDB client
│   └── neo4j.js           # Neo4j driver
├── middleware/            # Auth & role middleware
├── routes/                # API endpoints
│   ├── auth.js            # Registration, login, logout
│   ├── courses.js         # Course CRUD + enrollment
│   ├── exams.js           # Exam + question management
│   ├── submissions.js     # Exam start, save, submit
│   ├── proctoring.js      # Violation logging, reports
│   └── analytics.js       # Graph analysis, collusion
├── services/              # Business logic
│   ├── examSession.js     # Redis session manager
│   ├── proctoringLog.js   # CouchDB log writer
│   └── collusionDetector.js # Neo4j graph analysis
├── models/postgres/       # SQL schema
├── scripts/seed.js        # Demo data seeder
└── public/                # Frontend (HTML/CSS/JS)
```

## 🔗 API Endpoints

| Method | Endpoint | Description | DB Used |
|---|---|---|---|
| POST | /api/auth/register | Register user | PostgreSQL + Neo4j + Redis |
| POST | /api/auth/login | Login | PostgreSQL + Redis |
| GET | /api/courses | List courses | PostgreSQL |
| POST | /api/courses/:id/enroll | Enroll in course | PostgreSQL + Neo4j |
| POST | /api/submissions/start | Start exam | PostgreSQL + Redis |
| POST | /api/submissions/save | Auto-save answers | Redis |
| POST | /api/submissions/submit | Submit exam | PostgreSQL + Redis + CouchDB + Neo4j |
| POST | /api/proctor/violation | Log violation | Redis + CouchDB |
| GET | /api/proctor/active | Live sessions | Redis |
| GET | /api/analytics/graph | Relationship graph | Neo4j |
| GET | /api/analytics/collusion/:id | Detect cheating | Neo4j |
| GET | /api/health | DB health check | All 4 |
