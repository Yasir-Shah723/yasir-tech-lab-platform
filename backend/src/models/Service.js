import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
      trim: true,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    startingPrice: {
      type: Number,
      default: 0,
    },
    priceType: {
      type: String,
      enum: ['starting_at', 'custom_quote', 'fixed'],
      default: 'custom_quote',
    },
    icon: {
      type: String,
      default: 'Code2',
    },
    category: {
      type: String,
      enum: ['Frontend', 'Full Stack', 'Backend & APIs', 'Maintenance & Support', 'Consulting'],
      default: 'Full Stack',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before validation if missing
serviceSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;