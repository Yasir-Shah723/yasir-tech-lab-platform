import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitQuote,
  getAdminQuotes,
  updateQuoteStatus,
  deleteQuote,
} from '../controllers/quoteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: {
    success: false,
    message: 'Too many estimate requests submitted from this IP. Please wait 15 minutes before submitting another brief.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', quoteLimiter, submitQuote);

router.get('/admin/all', protect, getAdminQuotes);
router.patch('/admin/:id/status', protect, updateQuoteStatus);
router.delete('/admin/:id', protect, deleteQuote);

export default router;