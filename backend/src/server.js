import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { runEscalationCheck } from './services/escalationEngine.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
await connectDB();

// Scheduled Escalation Engine (Runs every 2 minutes)
setInterval(async () => {
  try {
    await runEscalationCheck();
  } catch (err) {
    console.error('[Scheduled Escalation Error]', err.message);
  }
}, 120000);

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  CIVIC AID BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
});

export default server;
