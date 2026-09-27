import QuoteRequest from '../models/QuoteRequest.js';
import AppError from '../utils/AppError.js';

// Public: Submit quote request
export const submitQuote = async (req, res, next) => {
  try {
    const {
      clientName,
      email,
      phone,
      company,
      projectType,
      budgetRange,
      timeline,
      features,
      description,
      _gotcha,
    } = req.body;

    // Honeypot check for automated form bots
    if (_gotcha) {
      return res.status(200).json({
        success: true,
        message: 'Your quote request has been received.',
      });
    }

    if (!clientName || !email || !projectType || !description) {
      return next(new AppError('Please complete all required fields.', 400));
    }

    const newQuote = await QuoteRequest.create({
      clientName,
      email,
      phone: phone || '',
      company: company || '',
      projectType,
      budgetRange: budgetRange || 'Flexible',
      timeline: timeline || 'Standard (2 - 4 weeks)',
      features: Array.isArray(features) ? features : [],
      description,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully! I will review your requirements and provide a technical estimate within 24 hours.',
      data: {
        id: newQuote._id,
        createdAt: newQuote.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all quote requests with search & status filters
export const getAdminQuotes = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { projectType: { $regex: search, $options: 'i' } },
      ];
    }

    const quotes = await QuoteRequest.find(query).sort({ createdAt: -1 });
    const pendingCount = await QuoteRequest.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      count: quotes.length,
      pendingCount,
      data: quotes,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update quote status
export const updateQuoteStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'reviewed', 'estimated', 'declined'];

    if (!allowed.includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const updated = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return next(new AppError(`Quote request not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: `Quote status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete quote
export const deleteQuote = async (req, res, next) => {
  try {
    const deleted = await QuoteRequest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Quote request not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Quote request deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};