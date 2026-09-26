import { v2 as cloudinary } from 'cloudinary';
import AppError from '../utils/AppError.js';

// Configure Cloudinary if credentials are present
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadToCloudinary = (fileBuffer, folder = 'yasir_tech_lab') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file was provided in the upload request', 400));
    }

    const isCloudinaryActive = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    let result;

    if (isCloudinaryActive) {
      const folder = req.body.folder || 'yasir_tech_lab/projects';
      const cloudResult = await uploadToCloudinary(req.file.buffer, folder);

      result = {
        url: cloudResult.secure_url,
        publicId: cloudResult.public_id,
        format: cloudResult.format,
        bytes: cloudResult.bytes,
        storage: 'cloudinary',
      };
    } else {
      // Local development fallback
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const localUrl = `${baseUrl}/uploads/${req.file.filename}`;

      result = {
        url: localUrl,
        publicId: req.file.filename,
        format: req.file.mimetype,
        bytes: req.file.size,
        storage: 'local',
      };
    }

    res.status(200).json({
      success: true,
      message: 'Media uploaded successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};