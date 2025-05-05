import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import animeRoutes from './routes/anime.js';
import historyRoutes from './routes/history.js';
import db from './db.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
db.connect().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Routes
app.use('/anime', animeRoutes);
app.use('/history', historyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AniList API server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
}); 