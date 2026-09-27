import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import ProfileSettings from '../src/models/ProfileSettings.js';

const seedSettings = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Settings] Connected to MongoDB');

    const count = await ProfileSettings.countDocuments();
    if (count === 0) {
      const created = await ProfileSettings.create({
        fullName: 'Syed Yasir Shah',
        headline: 'Full Stack Web Developer & Software Engineer',
        shortBio:
          'BS Computer Science graduate from SZABIST Islamabad specializing in production-grade MERN web development, REST API engineering, and web application security.',
        location: 'Rawalpindi / Islamabad, Pakistan',
        email: 'mrsyed640@gmail.com',
        phone: '03409479101',
        whatsappNumber: '923409479101',
        githubUrl: 'https://github.com/Yasir-Shah723',
        linkedinUrl: 'https://www.linkedin.com/in/syed-yasir-shah-69b076183/',
        fiverrUrl: 'https://www.fiverr.com/yasirtechlab/buying?source=avatar_menu_profile',
        resumeUrl: '',
      });
      console.log(`[Seed Settings] Initialized profile settings for: ${created.fullName}`);
    } else {
      console.log('[Seed Settings] Settings document already exists (skipping).');
    }

    process.exit(0);
  } catch (err) {
    console.error(`[Seed Settings Error] ${err.message}`);
    process.exit(1);
  }
};

seedSettings();