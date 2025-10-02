// Vercel serverless function for hero API
import { connectDB } from '../config/database.js';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: true, // Allow all origins in production, or specify your domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
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

export default async function handler(req, res) {
  // Handle CORS
  await runCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let db;
  
  try {
    // Connect to database
    db = await connectDB();
    const collection = db.collection('hero');
    
    if (req.method === 'GET') {
      const hero = await collection.findOne({});
      if (!hero) {
        return res.status(404).json({ error: 'Hero content not found' });
      }
      res.json(hero);
      
    } else if (req.method === 'POST') {
      const { title, description, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can edit hero content' });
      }
      
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
      
      const updatedHero = await collection.findOneAndUpdate(
        {},
        { 
          $set: { 
            title: title.trim(),
            description: description.trim(),
            updatedAt: new Date()
          }
        },
        { 
          upsert: true,
          returnDocument: 'after'
        }
      );
      
      res.json(updatedHero);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Hero API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}