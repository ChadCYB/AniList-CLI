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

    // Save the keyword if it's not already saved
    const cursor = await db.find('SearchHistoryKeyword', { keyword });
    const result = await cursor.toArray(); // Convert and close

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
    // TODO: Get anime by ID
    // - Interacts with the api.js to perform the get data by id and returns a JSON response
    // - Saves unique selections to the MongoDB SearchHistorySelection collection





    // return res.json(XXX);
  } catch (error) {
    console.error('Error getting anime details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 