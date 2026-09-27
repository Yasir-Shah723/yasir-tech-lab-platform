import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date is required (e.g. August 2026)'],
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    certificateImage: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [400, 'Description cannot exceed 400 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;