import Testimonial from '../models/Testimonial.js';
import AppError from '../utils/AppError.js';

// Public: Get published testimonials
export const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all testimonials
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create testimonial
export const createTestimonial = async (req, res, next) => {
  try {
    const newTestimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update testimonial
export const updateTestimonial = async (req, res, next) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError(`Testimonial not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete testimonial
export const deleteTestimonial = async (req, res, next) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Testimonial not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle publish
export const toggleTestimonialPublish = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError(`Testimonial not found with id: ${req.params.id}`, 404));
    }

    testimonial.published = !testimonial.published;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.published ? 'published' : 'hidden'} successfully`,
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};