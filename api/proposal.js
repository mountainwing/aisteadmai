// Vercel serverless function for proposal API
import { MongoClient } from 'mongodb';
import cors from 'cors';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

function runCors(req, res) {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Database connection
async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME || '_ethan_boyfriend_proposal';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  return client.db(databaseName);
}

export default async function handler(req, res) {
  await runCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let db;
  
  try {
    db = await connectDB();
    const collection = db.collection('proposal');
    
    if (req.method === 'GET') {
      const proposal = await collection.findOne({});
      if (!proposal) {
        // Return default values if no proposal exists
        return res.json({
          title: "So, My Love...",
          question: "Will you make me the happiest person alive and marry me?",
          buttonText: "Yes! Forever & Always",
          successTitle: "💍 Forever Starts Now 💍",
          successMessage: "You've just made all my dreams come true"
        });
      }
      res.json(proposal);
      
    } else if (req.method === 'POST') {
      const { title, question, buttonText, successTitle, successMessage } = req.body;
      
      if (!title || !question || !buttonText || !successTitle || !successMessage) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      const updatedProposal = await collection.findOneAndUpdate(
        {},
        { 
          $set: { 
            title: title.trim(),
            question: question.trim(),
            buttonText: buttonText.trim(),
            successTitle: successTitle.trim(),
            successMessage: successMessage.trim(),
            updatedAt: new Date()
          }
        },
        { 
          upsert: true,
          returnDocument: 'after'
        }
      );
      
      res.json(updatedProposal);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Proposal API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}