import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /history - Get search history (keywords or selections)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    // Handles validation of the type parameter
    // TODO: Accepts a required query parameter type with the value either keywords or selections
    // - Handles validation if the type is not provided and is not keywords or selections

    


    // return res.json(XXX);

    if (type === 'keywords') {
      // If the value is keywords
      // TODO: Get search history by keywords
      // - Is able to retrieve all saved selections from the SearchHistorySelection collection in MongoDB and return them in clean JSON format that does not include the Mongo _id




      
      // return res.json(XXX);
      
    } else {
      // If the value is selections
      // TODO: Get search history by selections
      // - Is able to retrieve all saved keywords from the SearchHistoryKeyword collection in MongoDB and return them in clean JSON format that does not include the Mongo _id


      


      // return res.json(XXX);
    }

  } catch (error) {
    console.error('Error getting history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 