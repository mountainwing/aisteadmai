import express from 'express';
import { connectToDatabase } from '../config/database.js';

const router = express.Router();

// GET /api/proposal - Get proposal content
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('proposal');
    
    const proposal = await collection.findOne({});
    if (!proposal) {
      // Return default values if no proposal exists
      return res.json({
        title: "So, My Love...",
        question: "Will you make me the happiest person alive and marry me?",
        buttonText: "Yes! Forever & Always",
        successTitle: "💍 Forever Starts Now 💍",
        successMessage: "You've just made all my dreams come true"
      });
    }
    res.json(proposal);
  } catch (error) {
    console.error('Proposal GET Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/proposal - Update proposal content
router.post('/', async (req, res) => {
  try {
    const { title, question, buttonText, successTitle, successMessage } = req.body;
    
    if (!title || !question || !buttonText || !successTitle || !successMessage) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const db = await connectToDatabase();
    const collection = db.collection('proposal');
    
    const updatedProposal = await collection.findOneAndUpdate(
      {},
      { 
        $set: { 
          title: title.trim(),
          question: question.trim(),
          buttonText: buttonText.trim(),
          successTitle: successTitle.trim(),
          successMessage: successMessage.trim(),
          updatedAt: new Date()
        }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    res.json(updatedProposal);
  } catch (error) {
    console.error('Proposal POST Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;