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
    //Show the keyword being searched
    console.log(`${colors.cyan}🔍 Searching for: "${keyword}"...${colors.reset}`);

    // Fetch search results
    const results = await searchByKeyword(keyword); //uses default page=1 and perPage = 10

    //Informs no results found
    if (!results || results.length === 0) {
      console.log(`${colors.yellow}⚠️ No results found for "${keyword}".${colors.reset}`);
      return;
    }
    
    // Display list of choices
    const choices = results.map(anime => ({
      name: `${anime.title.english || anime.title.romaji} (ID: ${anime.id})`,
      value: anime.id
    }));

    // Prompt user to select an anime via inquirer list
    const { selectedAnimeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedAnimeId',
        message: '🎥 Select an anime to view details:',
        choices
      }
    ]);

    // Fetch and display details of the selected anime
    await getByIdentifier(selectedAnimeId);

  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
};

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