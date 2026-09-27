import Blog from '../models/Blog.js';
import AppError from '../utils/AppError.js';

// Public: Get published blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search,$options: 'i' } },
        { summary: { $regex: search,$options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const blogs = await Blog.find(query).sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (err) {
    next(err);
  }
};

// Public: Get single blog by slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });

    if (!blog) {
      return next(new AppError(`No article found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all blogs
export const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create blog
export const createBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: newBlog,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update blog
export const updateBlog = async (req, res, next) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError(`Article not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete blog
export const deleteBlog = async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Article not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle publish status
export const toggleBlogPublish = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(new AppError(`Article not found with id: ${req.params.id}`, 404));
    }

    blog.published = !blog.published;
    if (blog.published && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Article ${blog.published ? 'published' : 'moved to drafts'} successfully`,
      data: blog,
    });
  } catch (err) {
    next(err);
  }
};