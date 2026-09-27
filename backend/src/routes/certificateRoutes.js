import express from 'express';
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getAllCertificates);

// Protected admin routes
router.post('/admin', protect, createCertificate);
router.put('/admin/:id', protect, updateCertificate);
router.delete('/admin/:id', protect, deleteCertificate);

export default router;