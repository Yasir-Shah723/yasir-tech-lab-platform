import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [300, 'Summary cannot exceed 300 characters'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    category: {
      type: String,
      enum: ['MERN Stack', 'Web Security', 'Performance', 'Software Engineering', 'Databases'],
      default: 'MERN Stack',
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and estimate read time before validation
blogSchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (this.content) {
    const wordCount = this.content.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;