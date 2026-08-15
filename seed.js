const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDataHelper = require('./seedDataHelper');

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDataHelper();
    console.log('Seed script finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed script failed:', error);
    process.exit(1);
  }
};

runSeed();
