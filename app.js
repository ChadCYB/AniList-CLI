import inquirer from 'inquirer';
import { searchByKeyword, getByIdentifier } from './api.js';
import { insert, find } from './db.js';

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

// Collection names for the database
const COLLECTIONS = {
  KEYWORDS: 'search_history_keywords',
  SELECTIONS: 'search_history_selections'
};

export const searchAnime = async (keyword) => {
  try {
    //TODO - Search Functionality
      
      
      
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
}

export const showHistory = async (type) => {
  try {
    if (type === 'keywords') {
      //TODO - History Functionality (keywords)
      
      

    } else {
      //TODO - History Functionality (selections)
      
      
      
    }
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
}