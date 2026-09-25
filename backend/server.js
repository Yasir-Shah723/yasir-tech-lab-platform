import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then boot the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Yasir Tech Lab Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});