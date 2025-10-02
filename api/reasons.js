// Vercel serverless function for reasons API
import { connectDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
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

export default async function handler(req, res) {
  await runCors(req, res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let db;
  
  try {
    db = await connectDB();
    const collection = db.collection('reasons');
    
    if (req.method === 'GET') {
      const reasons = await collection.find({}).sort({ order: 1 }).toArray();
      res.json(reasons);
      
    } else if (req.method === 'POST') {
      const { title, description, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can add reasons' });
      }
      
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }
      
      // Get the next order number
      const lastReason = await collection.findOne({}, { sort: { order: -1 } });
      const nextOrder = lastReason ? lastReason.order + 1 : 1;
      
      const newReason = {
        title: title.trim(),
        description: description.trim(),
        order: nextOrder,
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(newReason);
      const insertedReason = await collection.findOne({ _id: result.insertedId });
      
      res.status(201).json(insertedReason);
      
    } else if (req.method === 'PUT') {
      const { id, title, description, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can edit reasons' });
      }
      
      if (!id || !title || !description) {
        return res.status(400).json({ error: 'ID, title and description are required' });
      }
      
      const updatedReason = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            title: title.trim(),
            description: description.trim(),
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!updatedReason) {
        return res.status(404).json({ error: 'Reason not found' });
      }
      
      res.json(updatedReason);
      
    } else if (req.method === 'DELETE') {
      const { id, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can delete reasons' });
      }
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Reason not found' });
      }
      
      res.json({ message: 'Reason deleted successfully' });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Reasons API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}