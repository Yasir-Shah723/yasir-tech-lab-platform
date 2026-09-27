import express from 'express';
import {
  getProfileSettings,
  updateProfileSettings,
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProfileSettings);
router.put('/admin', protect, updateProfileSettings);

export default router;