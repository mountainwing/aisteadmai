import express from 'express';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

// GET reason header data
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const reasonHeaderCollection = db.collection('reasonheader');
    
    // Get the most recent reason header data (there should only be one document)
    const reasonHeaderData = await reasonHeaderCollection.findOne({}, { sort: { updatedAt: -1 } });
    
    if (!reasonHeaderData) {
      // Return default reason header data if none exists
      const defaultReasonHeader = {
        title: "Why You Should Be With Me Forever",
        subtitle: "Here are just a few of the infinite reasons",
        updatedAt: new Date(),
        createdAt: new Date()
      };
      return res.json(defaultReasonHeader);
    }
    
    res.json(reasonHeaderData);
  } catch (error) {
    console.error('Error fetching reason header data:', error);
    res.status(500).json({ error: 'Failed to fetch reason header data' });
  }
});

// POST/UPDATE reason header data
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, updatedBy } = req.body;
    
    // Validate required fields
    if (!title && !subtitle) {
      return res.status(400).json({ 
        error: 'At least one field (title or subtitle) is required' 
      });
    }

    if (!updatedBy) {
      return res.status(400).json({ error: 'updatedBy field is required' });
    }
    
    const db = await connectToDatabase();
    const reasonHeaderCollection = db.collection('reasonheader');
    
    const updateData = {
      updatedBy,
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    
    // Check if reason header document exists
    const existingReasonHeader = await reasonHeaderCollection.findOne({});
    
    let result;
    if (existingReasonHeader) {
      // Update existing document
      result = await reasonHeaderCollection.updateOne(
        { _id: existingReasonHeader._id },
        { $set: updateData }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: 'No changes were made' });
      }
      
      // Fetch and return updated document
      const updatedReasonHeader = await reasonHeaderCollection.findOne({ _id: existingReasonHeader._id });
      res.json({ message: 'Reason header data updated successfully', data: updatedReasonHeader });
    } else {
      // Create new document
      const newReasonHeader = {
        title: title || "Why You Should Be With Me Forever",
        subtitle: subtitle || "Here are just a few of the infinite reasons",
        createdBy: updatedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      result = await reasonHeaderCollection.insertOne(newReasonHeader);
      
      // Fetch and return created document
      const createdReasonHeader = await reasonHeaderCollection.findOne({ _id: result.insertedId });
      res.status(201).json({ message: 'Reason header data created successfully', data: createdReasonHeader });
    }
    
  } catch (error) {
    console.error('Error updating reason header data:', error);
    res.status(500).json({ error: 'Failed to update reason header data' });
  }
});

export default router;