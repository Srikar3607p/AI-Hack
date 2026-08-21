import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic_aid';
  
  try {
    mongoose.set('strictQuery', false);
    // Try connecting to primary URI with short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return;
  } catch (err) {
    console.warn(`[Database] Primary MongoDB at ${uri} unavailable (${err.message}). Starting In-Memory MongoDB for zero-config demo...`);
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to MongoMemoryServer: ${memoryUri}`);
  } catch (memoryErr) {
    console.error(`[Database] Failed to connect to in-memory database:`, memoryErr);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
