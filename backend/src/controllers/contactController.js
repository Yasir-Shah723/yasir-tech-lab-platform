import Message from '../models/Message.js';
import AppError from '../utils/AppError.js';

// Public: Submit message with honeypot spam verification
export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, _gotcha } = req.body;

    // Honeypot check: Bots fill hidden input fields that real users cannot see
    if (_gotcha) {
      // Quietly return success without saving anything to the database
      return res.status(200).json({
        success: true,
        message: 'Your message has been received successfully.',
      });
    }

    if (!name || !email || !subject || !message) {
      return next(new AppError('Please fill in all required fields.', 400));
    }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent. I will respond to your email shortly.',
      data: {
        id: newMessage._id,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all messages with filtering
export const getAdminMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search,$options: 'i' } },
        { email: { $regex: search,$options: 'i' } },
        { subject: { $regex: search,$options: 'i' } },
        { message: { $regex: search,$options: 'i' } },
      ];
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update status (unread, read, replied, archived)
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['unread', 'read', 'replied', 'archived'];

    if (!allowedStatuses.includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return next(new AppError(`Message not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: `Message marked as ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete message
export const deleteMessage = async (req, res, next) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Message not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Message permanently deleted',
    });
  } catch (err) {
    next(err);
  }
};