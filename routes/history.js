import express from 'express';
import db from '../db.js';

const router = express.Router();
const CHAR_LIMIT = 150;
// GET /history - Get search history (keywords or selections)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    // Handles validation of the type parameter
    // TODO: Accepts a required query parameter type with the value either keywords or selections
    // - Handles validation if the type is not provided and is not keywords or selections
    // return res.json(XXX);

    if (!type || (type !== 'keywords' && type !== 'selections')) {
      return res.status(400).json({ error: "Query parameter 'type' must be either 'keywords' or 'selections'" });
    }

    if (type === 'keywords') {

      const keywords = await db.find('SearchHistoryKeyword');
      const results = await keywords.toArray(); // Convert and close
      // Format the results to remove the MongoDB _id field
      const formatted = results.map(keyword => ({
        keyword: keyword.keyword,
        date: keyword.date
      }));
      // Send the response
      return res.json(formatted);
      // If the value is keywords
      // TODO: Get search history by keywords
      // - Is able to retrieve all saved selections from the SearchHistoryKeyword collection in MongoDB and return them in clean JSON format that does not include the Mongo _id
      
    } else {
      // If the value is selections
      // TODO: Get search history by selections
      // - Is able to retrieve all saved keywords from the SearchHistorySelection collection in MongoDB and return them in clean JSON format that does not include the Mongo _id

      const cursor = await db.find('SearchHistorySelection')
      const results = await cursor.toArray();
      const formatted = results.map(selection => ({
        id: selection.id,
        title: selection.title?.english || selection.title?.romaji || selection.title?.native || 'Unknown Title',
        score: selection.averageScore,
        description: selection.description.slice(0, CHAR_LIMIT) + '...'
      }));
      return res.json(formatted);
    }

  } catch (error) {
    console.error('Error getting history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 
