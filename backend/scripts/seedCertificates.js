import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Certificate from '../src/models/Certificate.js';

const initialCertificates = [
  {
    title: 'Google Cybersecurity Professional Certificate',
    issuingOrganization: 'Google (via Coursera)',
    issueDate: 'August 2026',
    credentialUrl: '',
    certificateImage: {
      url: '',
      alt: 'Google Cybersecurity Professional Certificate',
    },
    description:
      'Comprehensive 8-course credential covering SIEM log analysis, network protocol security, packet inspection with Wireshark/tcpdump, SQL security queries, threat modeling, vulnerability management, and incident response.',
    order: 1,
  },
  {
    title: 'Full Stack Web Development Certificate',
    issuingOrganization: 'DecodeLabs',
    issueDate: '2026',
    credentialUrl: '',
    certificateImage: {
      url: '',
      alt: 'DecodeLabs Full Stack Web Development Certificate',
    },
    description:
      '13-week intensive program validating core competencies in responsive UI design, React architecture, Express.js REST API engineering, and database modeling with MongoDB.',
    order: 2,
  },
  {
    title: 'Cybersecurity Training Certification',
    issuingOrganization: 'Asian Development Bank Institute (ADBI)',
    issueDate: '2026',
    credentialUrl: '',
    certificateImage: {
      url: '',
      alt: 'ADBI Cybersecurity Training Certification',
    },
    description:
      'Training focused on institutional cybersecurity governance, threat management, network resilience, and security incident response frameworks.',
    order: 3,
  },
  {
    title: 'Full Stack Web Development Internship Certificate',
    issuingOrganization: 'Rhombix Technologies',
    issueDate: 'September 2026',
    credentialUrl: '',
    certificateImage: {
      url: '',
      alt: 'Rhombix Technologies Internship Certificate',
    },
    description:
      'Completion credential for 3-month virtual internship developing full-stack web applications, REST CRUD endpoints, and asynchronous React state management.',
    order: 4,
  },
];

const seedCertificates = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Certificates] Connected to MongoDB');

    for (const certData of initialCertificates) {
      const existing = await Certificate.findOne({ title: certData.title });
      if (existing) {
        console.log(`[Seed Certificates] Exists: ${certData.title} (skipping)`);
      } else {
        const created = await Certificate.create(certData);
        console.log(`[Seed Certificates] Created: ${created.title}`);
      }
    }

    console.log('[Seed Certificates] Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Certificates Error] ${err.message}`);
    process.exit(1);
  }
};

seedCertificates();