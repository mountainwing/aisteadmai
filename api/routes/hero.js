import express from 'express';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

// GET hero data
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const heroCollection = db.collection('hero');
    
    // Get the most recent hero data (there should only be one document)
    const heroData = await heroCollection.findOne({}, { sort: { updatedAt: -1 } });
    
    if (!heroData) {
      // Return default hero data if none exists
      const defaultHero = {
        title: "Will You Marry Me?",
        description: "A journey through all the moments that led us here",
        backgroundImage: null,
        updatedAt: new Date(),
        createdAt: new Date()
      };
      return res.json(defaultHero);
    }
    
    res.json(heroData);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    res.status(500).json({ error: 'Failed to fetch hero data' });
  }
});

// POST/UPDATE hero data
router.post('/', async (req, res) => {
  try {
    const { title, description, backgroundImage } = req.body;
    
    // Validate required fields
    if (!title && !description && !backgroundImage) {
      return res.status(400).json({ 
        error: 'At least one field (title, description, or backgroundImage) is required' 
      });
    }
    
    const db = await connectToDatabase();
    const heroCollection = db.collection('hero');
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage;
    
    // Check if hero document exists
    const existingHero = await heroCollection.findOne({});
    
    let result;
    if (existingHero) {
      // Update existing document
      result = await heroCollection.updateOne(
        { _id: existingHero._id },
        { $set: updateData }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: 'No changes were made' });
      }
      
      // Fetch and return updated document
      const updatedHero = await heroCollection.findOne({ _id: existingHero._id });
      res.json({ message: 'Hero data updated successfully', data: updatedHero });
    } else {
      // Create new document
      const newHero = {
        title: title || "Will You Marry Me?",
        description: description || "A journey through all the moments that led us here",
        backgroundImage: backgroundImage || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      result = await heroCollection.insertOne(newHero);
      
      // Fetch and return created document
      const createdHero = await heroCollection.findOne({ _id: result.insertedId });
      res.status(201).json({ message: 'Hero data created successfully', data: createdHero });
    }
    
  } catch (error) {
    console.error('Error updating hero data:', error);
    res.status(500).json({ error: 'Failed to update hero data' });
  }
});

// DELETE hero data (for testing purposes)
router.delete('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const heroCollection = db.collection('hero');
    
    const result = await heroCollection.deleteMany({});
    
    res.json({ 
      message: `Deleted ${result.deletedCount} hero document(s)`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting hero data:', error);
    res.status(500).json({ error: 'Failed to delete hero data' });
  }
});

export default router;