import mongoose from 'mongoose';

const profileSettingsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: 'Syed Yasir Shah',
      trim: true,
    },
    headline: {
      type: String,
      default: 'Full Stack Web Developer & Software Engineer',
      trim: true,
    },
    shortBio: {
      type: String,
      default:
        'BS Computer Science graduate from SZABIST Islamabad specializing in production-grade MERN web development, REST API engineering, and web application security.',
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    location: {
      type: String,
      default: 'Rawalpindi / Islamabad, Pakistan',
      trim: true,
    },
    email: {
      type: String,
      default: 'mrsyed640@gmail.com',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '03409479101',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: '923409479101',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/Yasir-Shah723',
      trim: true,
    },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/syed-yasir-shah-69b076183/',
      trim: true,
    },
    fiverrUrl: {
      type: String,
      default: 'https://www.fiverr.com/yasirtechlab/buying?source=avatar_menu_profile',
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProfileSettings = mongoose.model('ProfileSettings', profileSettingsSchema);

export default ProfileSettings;