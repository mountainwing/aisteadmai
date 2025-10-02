import { MongoClient } from 'mongodb';

let client = null;
let db = null;

const connectToDatabase = async () => {
  if (db) {
    return db;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    const databaseName = process.env.MONGODB_DB_NAME || '_ethan_boyfriend_proposal';

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(databaseName);
    console.log(`Connected to MongoDB database: ${databaseName}`);
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

export { connectToDatabase, closeConnection };