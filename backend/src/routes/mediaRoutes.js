import express from 'express';
import { uploadMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protected admin endpoint for uploading a single file ('file' form-data field)
router.post('/upload', protect, upload.single('file'), uploadMedia);

export default router;