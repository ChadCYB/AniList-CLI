const fs = require('fs');
const path = require('path');

const DB_DIR = 'mock_database';
const KEYWORD_HISTORY_FILE = path.join(DB_DIR, 'search_history_keyword.json');
const SELECTION_HISTORY_FILE = path.join(DB_DIR, 'search_history_selection.json');

// Ensure the database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

// Initialize history files if they don't exist
if (!fs.existsSync(KEYWORD_HISTORY_FILE)) {
  fs.writeFileSync(KEYWORD_HISTORY_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SELECTION_HISTORY_FILE)) {
  fs.writeFileSync(SELECTION_HISTORY_FILE, JSON.stringify([], null, 2));
}

function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
}

function addToHistory(filePath, item) {
  const history = readJsonFile(filePath);
  if (!history.includes(item)) {
    history.push(item);
    writeJsonFile(filePath, history);
  }
}

function getHistory(filePath) {
  return readJsonFile(filePath);
}

module.exports = {
  addToHistory,
  getHistory,
  KEYWORD_HISTORY_FILE,
  SELECTION_HISTORY_FILE
}; 