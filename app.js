import inquirer from "inquirer";
import { getByIdentifier, searchByKeyword } from "./api.js";
import { find, insert } from "./db.js";

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

// Collection names for the database
const COLLECTIONS = {
  KEYWORDS: "search_history_keyword",
  SELECTIONS: "search_history_selection",
};

export const searchAnime = async (keyword) => {
  try {

    const existing = await find(COLLECTIONS.KEYWORDS, { keyword });
    if (existing.length === 0) {
      await insert(COLLECTIONS.KEYWORDS, {
        keyword,
        timestamp: new Date().getTime(),
      });
    }

    // Show the keyword being searched
    console.log(`${colors.cyan}🔍 Searching for: "${keyword}"...${colors.reset}`);

    // Fetch search results
    const results = await searchByKeyword(keyword); //uses default page=1 and perPage = 10

    // Informs no results found
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
    const anime = await getByIdentifier(selectedAnimeId);

    console.log("\n🎬 Anime Details:");
    console.log(`📌 Title: ${anime.title.english || anime.title.romaji || anime.title.native}`);
    console.log(`📆 Season: ${anime.season} ${anime.seasonYear}`);
    console.log(`⭐ Rating: ${anime.averageScore}/100`);
    console.log(`🎭 Genres: ${anime.genres.join(", ")}`);
    console.log(`📺 Episodes: ${anime.episodes || "Unknown"}`);
    console.log(`📝 Description:\n${anime.description.replace(/<[^>]*>/g, "")}\n`);
    

    const selectedAnime = results.find(anime => anime.id === selectedAnimeId);
    
    await insert(COLLECTIONS.SELECTIONS, {
      keyword,
      selected: selectedAnime.title.english || selectedAnime.title.romaji || "Unknown Title",
      id: selectedAnimeId
    });

  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
};

export const showHistory = async (type) => {
  try {
    // Show search history: Usage: node cli.js history keywords
    if (type === "keywords") {
      const history = await find(COLLECTIONS.KEYWORDS);

      if (history.length === 0) {
        console.log("No keyword in history.");
        return;
      }

      const choices = ["Exit", ...history.map((entry) => entry.keyword)];

      const { selectedKeyword } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedKeyword",
          message: "Select a keyword to search:",
          choices,
        },
      ]);

      if (selectedKeyword === "Exit") {
        console.log("Exiting...");
        return;
      }

      await searchAnime(selectedKeyword);
    } else {
      const history = await find(COLLECTIONS.SELECTIONS);

      if (history.length === 0) {
        console.log("No selection in history.");
        return;
      }

      const choices = ["Exit", ...history.map(
        (entry) => `${entry.selected} (Keyword: ${entry.keyword}, ID: ${entry.id})`
      )];

      const { selectedEntry } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedEntry",
          message: "Select an entry to view details:",
          choices,
        }
      ]);
      
      if (selectedEntry === "Exit") {
        console.log("Exiting...");
        return;
      }

      const idMatch = selectedEntry.match(/ID:\s*(\d+)/);
      const animeId = idMatch ? parseInt(idMatch[1]) : null;

      if (!animeId) {
        console.log("Invalid selection.");
        return;
      }

      const anime = await getByIdentifier(animeId);

      console.log("\n🎬 Anime Details:");
      console.log(`📌 Title: ${anime.title.english || anime.title.romaji || anime.title.native}`);
      console.log(`📆 Season: ${anime.season} ${anime.seasonYear}`);
      console.log(`⭐ Rating: ${anime.averageScore}/100`);
      console.log(`🎭 Genres: ${anime.genres.join(", ")}`);
      console.log(`📺 Episodes: ${anime.episodes || "Unknown"}`);
      console.log(`📝 Description:\n${anime.description.replace(/<[^>]*>/g, "")}\n`);
    }
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
};
