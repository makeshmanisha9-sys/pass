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
      if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        console.warn('⚠️ Warning: MONGODB_URI not set on Netlify Serverless Functions.');
        return null;
      }

      console.log('💡 Note: Starting built-in MongoDB engine for zero-config execution...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`✅ Embedded MongoDB ready at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);

    isConnected = true;
    console.log(`✅ MongoDB Connection Established: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
