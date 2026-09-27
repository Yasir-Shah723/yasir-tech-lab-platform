import Certificate from '../models/Certificate.js';
import AppError from '../utils/AppError.js';

// Public: Get all certificates
export const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create certificate
export const createCertificate = async (req, res, next) => {
  try {
    const newCertificate = await Certificate.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: newCertificate,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update certificate
export const updateCertificate = async (req, res, next) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError(`Certificate not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete certificate
export const deleteCertificate = async (req, res, next) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Certificate not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};