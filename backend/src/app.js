import express from 'express';
import cors from 'cors';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable Cross-Origin Resource Sharing with frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Built-in JSON body parser
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Yasir Tech Lab API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Catch unhandled routes and forward to error handler
app.all('/*splat', notFoundHandler);

// Global centralized error middleware
app.use(errorHandler);

export default app;