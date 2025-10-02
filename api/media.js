// Vercel serverless function for media API
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
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
      let media = await collection.find({}).sort({ uploadedAt: -1 }).toArray();
      
      // If no media items exist, seed with existing files
      if (media.length === 0) {
        const seedMedia = [
          {
            _id: new ObjectId(),
            filename: '1d134914-c7aa-4a23-a8f2-9622f5a2279c-1759398070035.jpg',
            originalName: 'beautiful-memory.jpg',
            mimetype: 'image/jpeg',
            size: 1024 * 200,
            type: 'image',
            url: '/api/uploads/1d134914-c7aa-4a23-a8f2-9622f5a2279c-1759398070035.jpg',
            uploadedBy: 'user',
            caption: 'A beautiful memory of us together',
            uploadedAt: new Date('2024-01-15T10:30:00Z')
          },
          {
            _id: new ObjectId(),
            filename: '1fad54ef-6db7-4cc7-91f2-2c3042d79ea7-1759398124124.mp4',
            originalName: 'our-favorite-video.mp4',
            mimetype: 'video/mp4',
            size: 1024 * 1024 * 5,
            type: 'video',
            url: '/api/uploads/1fad54ef-6db7-4cc7-91f2-2c3042d79ea7-1759398124124.mp4',
            uploadedBy: 'user',
            caption: 'Our favorite video together',
            uploadedAt: new Date('2024-01-20T14:20:00Z')
          }
        ];
        
        await collection.insertMany(seedMedia);
        media = seedMedia;
      }
      
      res.json(media);
      
    } else if (req.method === 'POST') {
      // For now, let's create a simple mock upload that works
      // In production, you'd typically use a service like Cloudinary or AWS S3
      const { fileName, fileType, caption, uploadedBy } = req.body;
      
      if (!fileName) {
        return res.status(400).json({ error: 'File name is required' });
      }

      // Create a mock media document (for demo purposes)
      const mediaDoc = {
        _id: new ObjectId(),
        filename: `${randomUUID()}-${Date.now()}.${fileName.split('.').pop() || 'jpg'}`,
        originalName: fileName || 'uploaded-file',
        mimetype: fileType || 'image/jpeg',
        size: 1024 * 100, // Mock size
        type: fileType?.startsWith('video/') ? 'video' : 'image',
        url: '/placeholder.svg', // Use placeholder for now
        uploadedBy: uploadedBy || 'user',
        caption: caption || '',
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