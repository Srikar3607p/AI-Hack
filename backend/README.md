# Civic Aid — Backend API

Node.js Express + Mongoose backend engine for Civic Aid.

## Features
- **Authentication & RBAC:** JWT authentication with role authorization (`CITIZEN`, `OFFICER`, `ADMIN`, `SUPER_ADMIN`).
- **Resilient Database Connectivity:** Connects to MongoDB Atlas or local MongoDB with automatic `MongoMemoryServer` fallback.
- **SLA Watchdog Engine:** Automatic background escalations for overdue civic cases.
- **AI Integration Bridge:** Centralized proxy to FastAPI microservice with in-process JS fallback.

## Scripts
```bash
# Install dependencies
npm install

# Seed database with realistic demo accounts & complaints
npm run seed

# Run server (http://localhost:5000)
npm run dev
# or
node src/server.js
```

## Environment
Create `.env` based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/civic_aid
JWT_SECRET=your_jwt_secret_here_change_this_in_production
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=
```
