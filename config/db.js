const mongoose = require('mongoose');
let mongoServer;
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.RENDER) {
        console.warn('⚠️ Warning: MONGODB_URI not set on Cloud Environment.');
        return null;
      }

      console.log('💡 Note: Starting built-in MongoDB engine for zero-config execution...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        console.log(`✅ Embedded MongoDB ready at: ${mongoUri}`);
      } catch (memErr) {
        console.error('Failed to start in-memory MongoDB:', memErr.message);
        return null;
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connection Established: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process on cloud hosts so web server stays online
    return null;
  }
};

module.exports = connectDB;
