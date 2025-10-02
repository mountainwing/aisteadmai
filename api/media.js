// Vercel serverless function for media API
import { connectDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import cors from 'cors';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
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
    const collection = db.collection('media');
    
    if (req.method === 'GET') {
      const media = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
      res.json(media);
      
    } else if (req.method === 'POST') {
      // For now, return a message about file upload limitations on Vercel
      res.status(501).json({ 
        error: 'File uploads not implemented for Vercel deployment. Consider using Cloudinary or AWS S3 for media storage.',
        message: 'Media upload feature requires external storage service in production.'
      });
      
    } else if (req.method === 'DELETE') {
      const { id, role } = req.body;
      
      if (role !== 'boyfriend') {
        return res.status(403).json({ error: 'Unauthorized: Only boyfriends can delete media' });
      }
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Media not found' });
      }
      
      res.json({ message: 'Media deleted successfully' });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Media API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}