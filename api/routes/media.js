import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// GET all media items
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mediaCollection = db.collection('media');
    
    const mediaItems = await mediaCollection
      .find({})
      .sort({ uploadedAt: -1 })
      .toArray();
    
    res.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media items' });
  }
});

// POST upload new media
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { caption, uploadedBy } = req.body;
    
    if (!uploadedBy) {
      return res.status(400).json({ error: 'uploadedBy field is required' });
    }

    const db = await connectToDatabase();
    const mediaCollection = db.collection('media');

    const mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    
    const mediaItem = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      type: mediaType,
      url: `/uploads/${req.file.filename}`,
      uploadedBy,
      uploadedAt: new Date(),
      caption: caption || undefined
    };

    const result = await mediaCollection.insertOne(mediaItem);
    const insertedMedia = await mediaCollection.findOne({ _id: result.insertedId });

    res.status(201).json({
      message: 'Media uploaded successfully',
      data: insertedMedia
    });
    
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// DELETE media item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username field is required' });
    }

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }

    const db = await connectToDatabase();
    const mediaCollection = db.collection('media');

    // Find the media item first to check ownership
    const mediaItem = await mediaCollection.findOne({ _id: new ObjectId(id) });
    
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    // Allow deletion by uploader or by boyfriend
    if (mediaItem.uploadedBy !== username && username !== 'boyfriend') {
      return res.status(403).json({ error: 'You can only delete your own media items or you must be the boyfriend' });
    }

    const result = await mediaCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    res.json({ 
      message: 'Media item deleted successfully',
      deletedId: id 
    });
    
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media item' });
  }
});

// PATCH update media caption
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username field is required' });
    }

    // Check if id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }

    const db = await connectToDatabase();
    const mediaCollection = db.collection('media');

    // Find the media item first to check ownership
    const mediaItem = await mediaCollection.findOne({ _id: new ObjectId(id) });
    
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    // Allow editing by uploader or by boyfriend
    if (mediaItem.uploadedBy !== username && username !== 'boyfriend') {
      return res.status(403).json({ error: 'You can only edit your own media items or you must be the boyfriend' });
    }

    const result = await mediaCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { caption: caption || undefined } }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'No changes were made' });
    }

    const updatedMedia = await mediaCollection.findOne({ _id: new ObjectId(id) });
    
    res.json({
      message: 'Media caption updated successfully',
      data: updatedMedia
    });
    
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ error: 'Failed to update media item' });
  }
});

export default router;