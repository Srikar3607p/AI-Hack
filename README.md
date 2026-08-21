# 🏛️ CIVIC AID
> **"Simple Civic Support at Your Fingertips."**  
> *An AI-Powered Civic Complaint-to-Resolution Intelligence Platform*

---

## 🌟 Executive Summary & 30-Second Judge Overview

**Civic Aid** is an enterprise-grade, hackathon-ready, deployable full-stack civic governance platform designed to transform unstructured citizen complaints into intelligent, prioritized, routed, tracked, and resolved civic cases.

### The 30-Second Story
1. **Citizen Reports:** A citizen reports a problem via speech dictation, text, photo, or map pin.
2. **AI Understands & Classifies:** The **AI Orchestrator** extracts category, sub-issue type, and safety hazards.
3. **Explainable Prioritization:** Computes a transparent **4-Factor Priority Score** (40% Impact + 35% Urgency + 15% Affected Citizens + 10% Duration).
4. **Duplicate Intelligence:** Geospatial and text similarity algorithms check if neighbors already reported the same issue within 300 meters.
5. **Smart Routing:** Auto-routes the case to the responsible municipal department and specialized field team with a custom SLA.
6. **Escalation Watchdog:** Proactive agents monitor SLA deadlines and escalate delayed cases to zonal supervisors.
7. **Officer Resolution & Verification:** Field officer executes repairs, uploads evidence, and the **AI Resolution Agent** verifies the work before updating the citizen with a clear, respectful explanation.
8. **Civic Insights & Learning:** Spatial clustering algorithms group recurring complaints to alert city planners to chronic infrastructure failures.

---

## 🔑 Pre-Configured Demo Credentials

For hackathon judges and evaluators, all demo accounts are pre-seeded and accessible via **1-Click Login buttons on the Landing & Login pages**:

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@civicaid.gov` | `Citizen@123` | Voice/Text reporting, GPS pin, Tracking, Reopen cases |
| **Citizen 2** | `anita.rao@civicaid.gov` | `Citizen@123` | Secondary citizen for duplicate & cluster scenarios |
| **Officer (Roads)** | `officer.roads@civicaid.gov` | `Officer@123` | Road repairs, Case triage, Resolution submission & photos |
| **Officer (Sanitation)** | `officer.sanitation@civicaid.gov` | `Officer@123` | Waste management, Rapid cleanup squads |
| **Admin** | `admin@civicaid.gov` | `Admin@123` | Analytics, Hotspot Maps, Escalations, Dept & Team config |
| **Super Admin** | `superadmin@civicaid.gov` | `SuperAdmin@123` | Root controls, User RBAC, Audit logs, System telemetry |

---

## 🏗️ Architecture & Tech Stack

```
+-----------------------------------------------------------------------------------+
|                              REACT 18 + VITE FRONTEND                             |
|  Tailwind CSS • Lucide Icons • React-Leaflet GIS • Recharts • Web Speech API       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                 REST APIs (JWT & RBAC)
                                          |
+-----------------------------------------v-----------------------------------------+
|                               NODE.JS EXPRESS BACKEND                             |
|  Auth, Mongoose ORM, GeoJSON Indexes, SLA Watchdog, Audit Logger, Multer Storage   |
+--------------------+------------------------------------+-------------------------+
                     |                                    |
            MongoDB Atlas / Memory                        | HTTP + In-Process Fallback
                     v                                    v
+------------------------------------+   +------------------------------------------+
|       MONGODB ATLAS DATABASE       |   |         PYTHON FASTAPI AI SERVICE        |
|  Users, Complaints, Departments,   |   |   AI Orchestrator + 8 Specialized Agents |
|  Teams, Clusters, Audit Logs, SLAs |   |   (Groq Llama 3.3 / Multimodal + Fallback)|
+------------------------------------+   +------------------------------------------+
```

### Technology Highlights
* **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, React-Leaflet, OpenStreetMap, Recharts, Lucide Icons, Web Speech Recognition API.
* **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs, Multer, Helmet, Morgan, MongoMemoryServer (automatic zero-config fallback).
* **AI Microservice:** Python 3.10+, FastAPI, Groq SDK (`llama-3.3-70b-versatile`, `llama-3.2-11b-vision-preview`), Pydantic.
* **100% Fallback Guarantee:** Dual-layer fallback (FastAPI rule classifier + in-process Node.js fallback) guarantees the platform never crashes even if the AI API is offline or unconfigured.

---

## 🤖 The 8 Specialized AI Agents

1. **Intake & Classification Agent:** Extracts structured categories, issue types, safety hazards, and tags from unstructured citizen input.
2. **Summarization Agent:** Distills long descriptions into 1 actionable sentence for municipal field crews.
3. **Priority Agent (Explainable 4-Factor Formula):**
   $$\text{Score} = (0.40 \times \text{Impact}) + (0.35 \times \text{Urgency}) + (0.15 \times \text{Citizens}) + (0.10 \times \text{Duration})$$
   Normalized to Low ($0-30$), Medium ($31-60$), High ($61-80$), Critical ($81-100$).
4. **Duplicate Detection Agent:** Computes text semantic similarity + Haversine geospatial proximity ($<300\text{m}$) to flag duplicate cases with master case linking.
5. **Routing Agent:** Matches complaints to municipal departments (Roads, Sanitation, Water, Drainage, Electrical, Public Facilities) and field squads.
6. **Follow-up Agent:** Tracks percentage of SLA elapsed and issues automated supervisor reminders.
7. **Escalation Agent:** Evaluates overdue complaints, determines escalation tier (Tier 1 Ward Supervisor $\to$ Tier 2 Zonal Officer $\to$ Tier 3 Commissioner), and generates executive briefs.
8. **Resolution Agent:** Compares before/after photos and officer work logs, verifies completion, and generates transparent citizen explanations.

---

## 🚀 Quick Start Guide (Run Locally in 2 Minutes)

### Prerequisites
* **Node.js:** v18+ installed
* **Python:** 3.10+ installed

### Step 1: Clone Repository
```bash
git clone <repo-url>
cd civic-aid
```

### Step 2: Seed Database
```bash
npm run seed
```
*(Automatically creates departments, escalation rules, demo accounts, and 12+ rich civic scenarios using MongoDB or built-in MongoMemoryServer).*

### Step 3: Run Backend API Server
```bash
npm run backend
# Server runs on http://localhost:5000
```

### Step 4: Run AI Microservice (Optional - Fallback Active by Default)
```bash
npm run ai-service
# FastAPI microservice runs on http://localhost:8000
```

### Step 5: Run Frontend
```bash
npm run frontend
# Vite frontend opens on http://localhost:5173
```

---

## 📡 Core API Endpoints

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Create citizen/officer account
* `POST /api/auth/login` - Authenticate and obtain JWT token
* `POST /api/auth/send-otp` - Dispatch phone verification OTP
* `POST /api/auth/verify-otp` - Verify mobile number
* `GET /api/auth/me` - Fetch authenticated user profile

### Complaints (`/api/complaints`)
* `POST /api/complaints` - Submit complaint (multipart with photos, voice transcript, and GPS coordinates)
* `GET /api/complaints` - Query complaints (role-based scoping, search, and category filters)
* `GET /api/complaints/:id` - Fetch complete case file with AI decision breakdown and timeline
* `PATCH /api/complaints/:id` - Update status and add field work notes
* `POST /api/complaints/:id/resolution` - Submit resolution notes + after photos with AI verification
* `POST /api/complaints/:id/reopen` - Reopen resolved case with citizen reason
* `POST /api/complaints/:id/reassign` - Administrative routing override

### Admin & Civic Insights (`/api/admin`)
* `GET /api/admin/analytics` - KPI metrics, Recharts telemetry, and department workloads
* `GET /api/admin/insights` - AI spatial clusters and recurring problem hotspots
* `GET /api/admin/escalations` - Overdue SLA breaches and active escalation rules
* `GET /api/admin/health` - Real-time system telemetry and microservice health checks
* `GET /api/admin/audit-logs` - Cryptographic system audit logs

---

## 🌐 Production Deployment Guide

| Service | Target Platform | Build Command | Start Command |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) | `npm run build` | Static (`dist/`) |
| **Backend API** | [Render](https://render.com) | `npm install` | `node src/server.js` |
| **AI Service** | [Render](https://render.com) | `pip install -r requirements.txt` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | N/A | Cloud URI |

---

## 🛡️ Security & Privacy Architecture
* **Cryptographic Hashing:** Passwords hashed with `bcryptjs` (salt rounds: 10).
* **JWT Expiration:** Signed bearer tokens with configurable expiration.
* **Role-Based Access Control (RBAC):** Middleware checks verify `CITIZEN`, `OFFICER`, `ADMIN`, `SUPER_ADMIN` on all sensitive routes.
* **MIME Validation:** Multer restricts uploads to JPEG, PNG, WEBP, and GIF under 10MB.
* **Audit Logging:** Administrative overrides, escalations, and status updates are recorded immutably in `AuditLog`.

---

## 👥 Contributors & Hackathon Team
* **Civic Aid Engineering Team**
* Built with 💙 for modern, transparent, and accountable civic governance.
