import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../src/models/User.js';

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to database');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminUsername || !adminPassword) {
      throw new Error('ADMIN_EMAIL, ADMIN_USERNAME, or ADMIN_PASSWORD missing from .env');
    }

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail.toLowerCase() }, { username: adminUsername.toLowerCase() }],
    });

    if (existingAdmin) {
      console.log(`[Seed] Admin user already exists: ${existingAdmin.email} (${existingAdmin.username})`);
      process.exit(0);
    }

    const newAdmin = await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log(`[Seed] Admin successfully created: ${newAdmin.email} (ID: ${newAdmin._id})`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();