import express from 'express';
import {
  getFullProfile,
  createExperience,
  deleteExperience,
  createEducation,
  deleteEducation,
  createSkill,
  deleteSkill,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getFullProfile);

// Protected admin routes
router.post('/experience', protect, createExperience);
router.delete('/experience/:id', protect, deleteExperience);

router.post('/education', protect, createEducation);
router.delete('/education/:id', protect, deleteEducation);

router.post('/skill', protect, createSkill);
router.delete('/skill/:id', protect, deleteSkill);

export default router;