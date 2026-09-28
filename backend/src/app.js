import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

// Error Handler Middleware
import { errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security and utility middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder (for uploaded certificate PDFs / images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ---------------------------------------------------------------------
// 1. API Route Registrations
// ---------------------------------------------------------------------
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/quotes', quoteRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/media', mediaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ---------------------------------------------------------------------
// 2. Production Static Frontend Serving (RIGHT HERE)
// ---------------------------------------------------------------------
// Root entry route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Yasir Tech Lab REST API is live and operational.',
  });
});

// ---------------------------------------------------------------------
// 3. Global Error Handling Middleware (Always at the very bottom)
// ---------------------------------------------------------------------
app.use(errorHandler);

export default app;