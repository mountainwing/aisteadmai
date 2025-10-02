// Vercel serverless function for reasonheader API
import { connectDB } from '../config/database.js';
import cors from 'cors';

// CORS configuration
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

export default async function handler(req, res) {
  await runCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let db;
  
  try {
    db = await connectDB();
    const collection = db.collection('reasonheader');
    
    if (req.method === 'GET') {
      const reasonHeader = await collection.findOne({});
      if (!reasonHeader) {
        // Return default values if no header exists
        return res.json({
          title: "Reasons Why I Love You",
          subtitle: "Every moment with you gives me a million more reasons to fall deeper in love"
        });
      }
      res.json(reasonHeader);
      
    } else if (req.method === 'POST') {
      const { title, subtitle, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can edit reason header' });
      }
      
      if (!title || !subtitle) {
        return res.status(400).json({ error: 'Title and subtitle are required' });
      }
      
      const updatedHeader = await collection.findOneAndUpdate(
        {},
        { 
          $set: { 
            title: title.trim(),
            subtitle: subtitle.trim(),
            updatedAt: new Date()
          }
        },
        { 
          upsert: true,
          returnDocument: 'after'
        }
      );
      
      res.json(updatedHeader);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('ReasonHeader API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}