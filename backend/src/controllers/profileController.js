import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Skill from '../models/Skill.js';
import AppError from '../utils/AppError.js';

// Public: Get aggregated profile background
export const getFullProfile = async (req, res, next) => {
  try {
    const [experiences, education, skills] = await Promise.all([
      Experience.find().sort({ order: 1, createdAt: -1 }),
      Education.find().sort({ order: 1, createdAt: -1 }),
      Skill.find().sort({ order: 1, name: 1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        experiences,
        education,
        skills,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Experience CRUD
export const createExperience = async (req, res, next) => {
  try {
    const created = await Experience.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const deleted = await Experience.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Experience entry not found', 404));
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    next(err);
  }
};

// Admin: Education CRUD
export const createEducation = async (req, res, next) => {
  try {
    const created = await Education.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const deleted = await Education.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Education entry not found', 404));
    res.status(200).json({ success: true, message: 'Education deleted' });
  } catch (err) {
    next(err);
  }
};

// Admin: Skill CRUD
export const createSkill = async (req, res, next) => {
  try {
    const created = await Skill.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Skill entry not found', 404));
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
};