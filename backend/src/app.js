import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import serviceRoutes from './routes/serviceRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';

const app = express();

// Secure HTTP headers (allow cross-origin resource loading for static images)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable Cross-Origin Resource Sharing with frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Built-in JSON body parser
app.use(express.json());

// Serve local uploads folder statically for development fallback
app.use('/uploads', express.static(path.resolve('uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Yasir Tech Lab API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/quotes', quoteRoutes);

// Catch unhandled routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;