// Vercel serverless function for media API
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
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
    const collection = db.collection('media');
    
    if (req.method === 'GET') {
      const media = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
      res.json(media);
      
    } else if (req.method === 'POST') {
      // Handle file upload
      const form = new IncomingForm({
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        uploadDir: '/tmp',
        keepExtensions: true
      });

      const [fields, files] = await form.parse(req);
      
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Read file data and convert to base64 for storage
      const fileBuffer = readFileSync(file.filepath);
      const fileBase64 = fileBuffer.toString('base64');

      // Create media document
      const mediaDoc = {
        _id: new ObjectId(),
        filename: `${randomUUID()}-${Date.now()}.${file.originalFilename?.split('.').pop() || 'jpg'}`,
        originalName: file.originalFilename || 'uploaded-file',
        mimetype: file.mimetype || 'application/octet-stream',
        size: file.size,
        type: file.mimetype?.startsWith('video/') ? 'video' : 'image',
        data: fileBase64, // Store file data as base64
        uploadedBy: Array.isArray(fields.uploadedBy) ? fields.uploadedBy[0] : fields.uploadedBy || 'user',
        caption: Array.isArray(fields.caption) ? fields.caption[0] : fields.caption || '',
        uploadedAt: new Date()
      };

      const result = await collection.insertOne(mediaDoc);
      
      // Return the created media item
      const createdMedia = await collection.findOne({ _id: result.insertedId });
      res.json(createdMedia);
      
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Media not found' });
      }
      
      res.json({ message: 'Media deleted successfully' });
      
    } else if (req.method === 'PATCH') {
      const { id, caption } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            caption: caption || '',
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Media not found' });
      }
      
      const updatedMedia = await collection.findOne({ _id: new ObjectId(id) });
      res.json(updatedMedia);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
    
  } catch (error) {
    console.error('Media API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}