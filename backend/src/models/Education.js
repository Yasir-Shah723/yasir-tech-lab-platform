import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      default: '',
      trim: true,
    },
    graduationDate: {
      type: String,
      required: [true, 'Graduation date is required (e.g. July 2026)'],
    },
    grade: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Education = mongoose.model('Education', educationSchema);
export default Education;