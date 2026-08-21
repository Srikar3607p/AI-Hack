# Civic Aid — Frontend

React 18 + Vite + Tailwind CSS client for the Civic Aid complaint-to-resolution intelligence platform.

## Features
- **Design System:** Government/official aesthetics with full Light/Dark mode support.
- **Role-Scaffolded Routing:** Portals for Citizen, Department Officer, Administrator, and Super Administrator.
- **GIS & Visuals:** Leaflet OpenStreetMap location picker and Recharts telemetry graphs.
- **Voice Recognition:** Web Speech API integration for accessible grievance filing.

## Scripts
```bash
# Install dependencies
npm install

# Run Vite dev server (http://localhost:5173)
npm run dev

# Production build
npm run build
```

## Environment
Create `.env` based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Civic Aid
```
