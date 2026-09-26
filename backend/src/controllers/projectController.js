import Project from '../models/Project.js';
import AppError from '../utils/AppError.js';

// Public: Get published projects
export const getAllProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { published: true };

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// Public: Get single project by slug
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true });

    if (!project) {
      return next(new AppError(`No project found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all projects (including drafts)
export const getAdminProjects = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search,$options: 'i' } },
        { shortDescription: { $regex: search,$options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create project
export const createProject = async (req, res, next) => {
  try {
    const newProject = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update project
export const updateProject = async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError(`Project not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError(`Project not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle publish status
export const togglePublish = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new AppError(`Project not found with id: ${req.params.id}`, 404));
    }

    project.published = !project.published;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.published ? 'published' : 'unpublished'} successfully`,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Toggle featured status
export const toggleFeatured = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new AppError(`Project not found with id: ${req.params.id}`, 404));
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.featured ? 'marked as featured' : 'removed from featured'}`,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};