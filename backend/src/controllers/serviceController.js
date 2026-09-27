import Service from '../models/Service.js';
import AppError from '../utils/AppError.js';

// Public: Get all active services
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all services
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create service
export const createService = async (req, res, next) => {
  try {
    const newService = await Service.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update service
export const updateService = async (req, res, next) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError(`Service not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete service
export const deleteService = async (req, res, next) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Service not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle active state
export const toggleServiceActive = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError(`Service not found with id: ${req.params.id}`, 404));
    }

    service.active = !service.active;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.active ? 'activated' : 'deactivated'} successfully`,
      data: service,
    });
  } catch (err) {
    next(err);
  }
};