import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    caption: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Short description cannot exceed 500 characters'],
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
    },
    problem: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    keyFeatures: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
    },
    role: {
      type: String,
      default: 'Full Stack Developer',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Full Stack', 'Frontend', 'Backend', 'Web Application', 'E-Commerce', 'Booking System'],
      default: 'Full Stack',
    },
    projectType: {
      type: String,
      enum: ['Personal Project', 'Academic / Capstone', 'Client Project', 'Freelance Work'],
      default: 'Personal Project',
    },
    status: {
      type: String,
      enum: ['Completed', 'In Active Development', 'Maintained'],
      default: 'Completed',
    },
    completionDate: {
      type: String,
      default: '',
    },
    clientType: {
      type: String,
      default: 'Portfolio / Demonstration',
    },
    thumbnail: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    gallery: {
      type: [galleryItemSchema],
      default: [],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub repository link is required'],
      trim: true,
    },
    liveDemoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to slugify titles if slug is missing or modified
projectSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;