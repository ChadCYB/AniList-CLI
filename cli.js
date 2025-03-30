import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { searchAnime, showHistory } from './app.js';

// hideBin is a helper that removes the first two elements from process.argv
yargs(hideBin(process.argv))
  .usage('$0 Usage <command> [options]')
  // Search Command
  .command(
    'search <keyword>',
    'Search for anime by keyword',
    (yargs) => {
      yargs.positional('keyword', {
        describe: 'Name of the anime',
        type: 'string',
      });
    },
    async (argv) => {
      await searchAnime(argv.keyword);
    }
  )
  // History Command
  .command(
    'history <type>',
    'View a history of searches and selected anime',
    (yargs) => {
      yargs.positional('type', {
        describe: 'View history by keywords or selections',
        type: 'string',
        choices: ['keywords', 'selections'],
      });
    },
    async (argv) => {
      await showHistory(argv.type);
    }
  )
  .strict()  // handle incorrect commands
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;
