import express from 'express';
import * as api from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();

// GET /anime - Search anime by keyword
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    // Handles validation of the keyword parameter
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
   
    const results = await api.searchByKeyword(keyword);

    const formattedResults = results.map(item => {
      const title = item.title || item.display || {};
      const displayText = title.english || title.romaji || 'No Title';

      return {
        display: displayText,
        identifier: item.id || item.identifier || item.mal_id || 'No ID'
      };
    });
    // Check if the keyword is already saved in the database
    // Save the keyword if it's not already saved
    const cursor = await db.find('SearchHistoryKeyword', { keyword });
    const result = await cursor.toArray(); 

    const alreadyExists = result.length > 0;


    if (!alreadyExists) {
      await db.insert('SearchHistoryKeyword', { keyword });
    }

    // Send the response
    return res.json(formattedResults);
  } catch (error) {
    console.error('Error searching anime:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /anime/:id - Get anime by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const animeData = await api.getByIdentifier(id);

    const existing = await db.find('SearchHistorySelection', { id: animeData.id });

    const existingArray = await existing.toArray();

    if (existingArray.length === 0) {
      await db.insert('SearchHistorySelection', animeData);
    }
    return res.json(animeData);

  } catch (error) {
    console.error('Error getting anime details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 