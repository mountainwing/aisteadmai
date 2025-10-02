import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

// GET all reasons
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const reasonsCollection = db.collection('reasons');
    
    // Get all reasons sorted by order, then by creation date
    const reasons = await reasonsCollection
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();
    
    res.json(reasons);
  } catch (error) {
    console.error('Error fetching reasons:', error);
    res.status(500).json({ error: 'Failed to fetch reasons' });
  }
});

// POST create new reason
router.post('/', async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;
    
    // Validate required fields
    if (!title || !description || !createdBy) {
      return res.status(400).json({ 
        error: 'Title, description, and createdBy are required' 
      });
    }
    
    const db = await connectToDatabase();
    const reasonsCollection = db.collection('reasons');
    
    // Get the next order number
    const lastReason = await reasonsCollection
      .findOne({}, { sort: { order: -1 } });
    const nextOrder = lastReason ? lastReason.order + 1 : 1;
    
    const newReason = {
      title,
      description,
      order: nextOrder,
      createdBy,
      updatedBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await reasonsCollection.insertOne(newReason);
    const insertedReason = await reasonsCollection.findOne({ _id: result.insertedId });

    res.status(201).json({
      message: 'Reason created successfully',
      data: insertedReason
    });
    
  } catch (error) {
    console.error('Error creating reason:', error);
    res.status(500).json({ error: 'Failed to create reason' });
  }
});

// PUT update existing reason
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, updatedBy } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid reason ID' });
    }

    if (!updatedBy) {
      return res.status(400).json({ error: 'updatedBy field is required' });
    }

    const db = await connectToDatabase();
    const reasonsCollection = db.collection('reasons');

    // Find the reason first to check if it exists
    const existingReason = await reasonsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!existingReason) {
      return res.status(404).json({ error: 'Reason not found' });
    }

    const updateData = {
      updatedBy,
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const result = await reasonsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'No changes were made' });
    }

    const updatedReason = await reasonsCollection.findOne({ _id: new ObjectId(id) });
    
    res.json({
      message: 'Reason updated successfully',
      data: updatedReason
    });
    
  } catch (error) {
    console.error('Error updating reason:', error);
    res.status(500).json({ error: 'Failed to update reason' });
  }
});

// DELETE reason
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid reason ID' });
    }

    if (!deletedBy) {
      return res.status(400).json({ error: 'deletedBy field is required' });
    }

    const db = await connectToDatabase();
    const reasonsCollection = db.collection('reasons');

    // Find the reason first to check if it exists
    const reasonToDelete = await reasonsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!reasonToDelete) {
      return res.status(404).json({ error: 'Reason not found' });
    }

    // Only allow boyfriend to delete
    if (deletedBy !== 'boyfriend') {
      return res.status(403).json({ error: 'Only the boyfriend can delete reasons' });
    }

    const result = await reasonsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Reason not found' });
    }

    // Reorder remaining reasons to fill the gap
    const remainingReasons = await reasonsCollection
      .find({ order: { $gt: reasonToDelete.order } })
      .sort({ order: 1 })
      .toArray();
      
    for (let i = 0; i < remainingReasons.length; i++) {
      await reasonsCollection.updateOne(
        { _id: remainingReasons[i]._id },
        { $set: { order: reasonToDelete.order + i } }
      );
    }

    res.json({ 
      message: 'Reason deleted successfully',
      deletedId: id 
    });
    
  } catch (error) {
    console.error('Error deleting reason:', error);
    res.status(500).json({ error: 'Failed to delete reason' });
  }
});

// PUT reorder reasons
router.put('/reorder/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { newOrder, updatedBy } = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid reason ID' });
    }

    if (typeof newOrder !== 'number' || newOrder < 1) {
      return res.status(400).json({ error: 'Valid newOrder is required' });
    }

    if (!updatedBy) {
      return res.status(400).json({ error: 'updatedBy field is required' });
    }

    const db = await connectToDatabase();
    const reasonsCollection = db.collection('reasons');

    // Find the reason to reorder
    const reasonToMove = await reasonsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!reasonToMove) {
      return res.status(404).json({ error: 'Reason not found' });
    }

    const oldOrder = reasonToMove.order;

    // If moving to a higher position
    if (newOrder > oldOrder) {
      await reasonsCollection.updateMany(
        { order: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { order: -1 } }
      );
    }
    // If moving to a lower position  
    else if (newOrder < oldOrder) {
      await reasonsCollection.updateMany(
        { order: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }

    // Update the target reason's order
    await reasonsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          order: newOrder, 
          updatedBy,
          updatedAt: new Date()
        } 
      }
    );

    // Get all reasons in new order
    const reorderedReasons = await reasonsCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    res.json({
      message: 'Reasons reordered successfully',
      data: reorderedReasons
    });
    
  } catch (error) {
    console.error('Error reordering reasons:', error);
    res.status(500).json({ error: 'Failed to reorder reasons' });
  }
});

export default router;