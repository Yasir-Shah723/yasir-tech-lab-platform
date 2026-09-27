import express from 'express';
import {
  getAllServices,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllServices);

// Admin Protected
router.get('/admin/all', protect, getAdminServices);
router.post('/admin', protect, createService);
router.put('/admin/:id', protect, updateService);
router.delete('/admin/:id', protect, deleteService);
router.patch('/admin/:id/toggle-active', protect, toggleServiceActive);

export default router;