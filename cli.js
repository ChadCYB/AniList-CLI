#!/usr/bin/env node

const { program } = require('commander');
const { searchAnime, showHistory } = require('./app');

program
  .name('anilist-cli')
  .description('CLI application for searching and viewing anime information from AniList')
  .version('1.0.0');

program
  .command('search')
  .description('Search for anime by keyword')
  .argument('<keyword>', 'Search keyword')
  .action(async (keyword) => {
    await searchAnime(keyword);
  });

program
  .command('history')
  .description('View search or selection history')
  .argument('<type>', 'Type of history to view (keywords or selections)')
  .action(async (type) => {
    if (type !== 'keywords' && type !== 'selections') {
      console.error('Error: Type must be either "keywords" or "selections"');
      process.exit(1);
    }
    await showHistory(type);
  });

program.parse(); 