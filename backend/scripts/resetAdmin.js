import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not set in backend/.env');
    }

    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 1. Drop the legacy unique username index if it exists
    try {
      await usersCollection.dropIndex('username_1');
      console.log('Dropped obsolete index: username_1');
    } catch (idxErr) {
      // Ignore if index doesn't exist
      if (idxErr.codeName !== 'IndexNotFound') {
        console.log('Note on index check:', idxErr.message);
      }
    }

    const email = 'mrsyed640@gmail.com';
    const rawPassword = 'AdminPassword123!';

    // 2. Clear out any previous admin user records
    await usersCollection.deleteMany({
      $or: [{ email }, { email: 'admin@yasirtechlab.com' }, { role: 'admin' }],
    });
    console.log('Cleared previous admin user records.');

    // 3. Hash the password once
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // 4. Insert fresh admin document
    await usersCollection.insertOne({
      name: 'Syed Yasir Shah',
      username: 'yasir',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('--------------------------------------------------');
    console.log('Admin account created successfully!');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${rawPassword}`);
    console.log('--------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Reset error:', err.message);
    process.exit(1);
  }
};

resetAdmin();