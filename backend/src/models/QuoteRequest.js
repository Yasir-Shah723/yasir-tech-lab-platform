import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      enum: [
        'Full Stack Web App',
        'Custom Business Website',
        'E-Commerce Store',
        'Booking / Reservation Engine',
        'REST API Backend',
        'Bug Fix / Maintenance',
        'Other Custom System',
      ],
      default: 'Full Stack Web App',
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
      default: 'Flexible',
    },
    timeline: {
      type: String,
      default: 'Standard (2 - 4 weeks)',
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Project details are required'],
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'estimated', 'declined'],
      default: 'pending',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

quoteRequestSchema.index({ status: 1, createdAt: -1 });

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);

export default QuoteRequest;