import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';
import Testimonial from '../models/Testimonial.js';
import AppError from '../utils/AppError.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Admin Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide an email and password', 400));
    }

    // Explicitly include password hash because select: false is set on the schema
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user._id);

    // Remove password hash from JSON response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// Get current logged-in user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// Update Admin Password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Please provide both current and new password', 400));
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// Admin Dashboard Dynamic Statistics
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      totalServices,
      totalCertificates,
      totalBlogs,
      unreadMessages,
      totalMessages,
      totalTestimonials,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Certificate.countDocuments(),
      Blog.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Message.countDocuments(),
      Testimonial.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalServices,
        totalCertificates,
        totalBlogs,
        unreadMessages,
        totalMessages,
        totalTestimonials,
        recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};