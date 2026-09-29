import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// Models imported to fetch live counts for the dashboard
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';
import QuoteRequest from '../models/QuoteRequest.js';
import Testimonial from '../models/Testimonial.js';

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'YasirTechLab_Production_Super_Secret_Key_2026!';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/v1/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log(`[AUTH] Login failed: User not found for ${cleanEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Uses the matchPassword helper from userSchema
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[AUTH] Login failed: Password mismatch for ${cleanEmail}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(user._id);

    console.log(`[AUTH] Login SUCCESS for ${cleanEmail}`);
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[AUTH] Login server crash:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a password reset link has been sent.',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'https://yasir-tech-lab-platform.vercel.app';
    const resetUrl = `${clientUrl}/admin/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.5;">
          Hello Yasir, click the button below to choose a new password for your admin account. This link is valid for <strong>15 minutes</strong>:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Admin Password
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Yasir Tech Lab - Admin Password Reset',
        html,
      });

      return res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email.',
      });
    } catch (mailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Mail error:', mailErr);
      return res.status(500).json({
        success: false,
        message: 'Email service error.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PATCH /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired.',
      });
    }

    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    // Setting password triggers the pre('save') hook in userSchema to hash it automatically
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully updated! You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/v1/auth/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalServices,
      totalCertificates,
      totalBlogs,
      totalTestimonials,
      totalQuotes,
      pendingQuotes,
      totalMessages,
      unreadMessages,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments().catch(() => 0),
      Service.countDocuments().catch(() => 0),
      Certificate.countDocuments().catch(() => 0),
      Blog.countDocuments().catch(() => 0),
      Testimonial.countDocuments().catch(() => 0),
      QuoteRequest.countDocuments().catch(() => 0),
      QuoteRequest.countDocuments({ status: 'pending' }).catch(() => 0),
      Message.countDocuments().catch(() => 0),
      Message.countDocuments({ status: 'unread' }).catch(() => 0),
      Message.find().sort({ createdAt: -1 }).limit(5).catch(() => []),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalServices,
        totalCertificates,
        totalBlogs,
        totalTestimonials,
        totalQuotes,
        pendingQuotes,
        totalMessages,
        unreadMessages,
        recentMessages,
      },
    });
  } catch (error) {
    console.error('Failed to aggregate admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve system metrics.',
    });
  }
};