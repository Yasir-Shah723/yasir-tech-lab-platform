import ProfileSettings from '../models/ProfileSettings.js';

// Public: Fetch profile settings
export const getProfileSettings = async (req, res, next) => {
  try {
    let settings = await ProfileSettings.findOne();

    if (!settings) {
      // Auto-create defaults if table was emptied
      settings = await ProfileSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update profile settings
export const updateProfileSettings = async (req, res, next) => {
  try {
    let settings = await ProfileSettings.findOne();

    if (!settings) {
      settings = await ProfileSettings.create(req.body);
    } else {
      settings = await ProfileSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile settings updated successfully',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};