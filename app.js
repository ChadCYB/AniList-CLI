const inquirer = require('inquirer');
const chalk = require('chalk');
const { searchByKeyword, getDetailsById } = require('./api');
const { addToHistory, getHistory, KEYWORD_HISTORY_FILE, SELECTION_HISTORY_FILE } = require('./db');

async function searchAnime(keyword) {
  try {
    const results = await searchByKeyword(keyword);
    addToHistory(KEYWORD_HISTORY_FILE, keyword);

    const choices = results.map(anime => ({
      name: `${anime.title.english || anime.title.romaji} (${anime.type})`,
      value: anime.id
    }));

    const { selectedId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedId',
        message: 'Select an anime to view details:',
        choices
      }
    ]);

    const selectedAnime = results.find(anime => anime.id === selectedId);
    addToHistory(SELECTION_HISTORY_FILE, selectedAnime.id);

    const details = await getDetailsById(selectedId);
    displayAnimeDetails(details);
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }
}

async function showHistory(type) {
  const history = getHistory(type === 'keywords' ? KEYWORD_HISTORY_FILE : SELECTION_HISTORY_FILE);
  
  if (history.length === 0) {
    console.log(chalk.yellow('No history found.'));
    return;
  }

  const choices = [
    { name: 'Exit', value: 'exit' },
    ...history.map(item => ({
      name: type === 'keywords' ? item : `ID: ${item}`,
      value: item
    }))
  ];

  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: `Select from ${type} history:`,
      choices
    }
  ]);

  if (selected === 'exit') {
    return;
  }

  if (type === 'keywords') {
    await searchAnime(selected);
  } else {
    const details = await getDetailsById(selected);
    displayAnimeDetails(details);
  }
}

function displayAnimeDetails(anime) {
  console.log('\n' + chalk.cyan('=== Anime Details ==='));
  console.log(chalk.white('Title:'), anime.title.english || anime.title.romaji);
  if (anime.title.native) {
    console.log(chalk.white('Native Title:'), anime.title.native);
  }
  console.log(chalk.white('Type:'), anime.type);
  console.log(chalk.white('Format:'), anime.format);
  console.log(chalk.white('Status:'), anime.status);
  console.log(chalk.white('Episodes:'), anime.episodes || 'Unknown');
  console.log(chalk.white('Duration:'), anime.duration ? `${anime.duration} minutes` : 'Unknown');
  console.log(chalk.white('Genres:'), anime.genres.join(', '));
  console.log(chalk.white('Score:'), anime.averageScore ? `${anime.averageScore}/100` : 'N/A');
  
  if (anime.studios?.nodes?.length > 0) {
    console.log(chalk.white('Studios:'), anime.studios.nodes.map(s => s.name).join(', '));
  }

  const startDate = anime.startDate;
  const endDate = anime.endDate;
  console.log(chalk.white('Aired:'), 
    `${startDate.year || '?'}/${startDate.month || '?'}/${startDate.day || '?'} to ` +
    `${endDate.year || '?'}/${endDate.month || '?'}/${endDate.day || '?'}`
  );

  console.log('\n' + chalk.white('Description:'));
  console.log(anime.description || 'No description available.');
  console.log('\n');
}

module.exports = {
  searchAnime,
  showHistory
}; 