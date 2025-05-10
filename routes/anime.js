import express from 'express';
import * as api from '../api.js';
import db from '../db.js';

const router = express.Router();

// GET /anime - Search anime by keyword
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    // TODO: Search anime by keyword
    // - Interacts with the api.js to perform the to search by keyword and returns a JSON response
    // - The JSON response should be minimal and clean, containing only two keys for each item:
    //   - display: a readable display name associated with the keyword
    //   - identifier: the ID and/or value needed to perform future requests
    // - Saves unique search keywords to the MongoDB SearchHistoryKeyword collection



    

    // return res.json(result);
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