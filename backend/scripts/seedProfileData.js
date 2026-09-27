import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Experience from '../src/models/Experience.js';
import Education from '../src/models/Education.js';
import Skill from '../src/models/Skill.js';

const initialExperiences = [
  {
    company: 'Rhombix Technologies',
    role: 'Full Stack Web Development Intern',
    employmentType: 'Virtual Internship',
    duration: '3 Months (July 2026 – September 2026)',
    startDate: 'July 2026',
    endDate: 'September 2026',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    highlights: [
      'Engineered full-stack web applications using React and Node.js REST services',
      'Implemented persistent data models and CRUD operations in MongoDB',
      'Built responsive user interfaces and managed asynchronous state transitions',
    ],
    order: 1,
  },
  {
    company: 'DecodeLabs',
    role: 'Full Stack Development Intern',
    employmentType: 'Virtual Internship',
    duration: '13-Week Intensive Program',
    startDate: '2026',
    endDate: '2026',
    technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    highlights: [
      'Completed comprehensive full-stack training across modern frontend and backend architectures',
      'Constructed responsive multi-page layouts with Bootstrap and React components',
      'Developed and integrated RESTful APIs with Express and Mongoose schemas',
    ],
    order: 2,
  },
];

const initialEducation = [
  {
    institution: 'SZABIST Islamabad',
    degree: 'Bachelor of Science in Computer Science (BSCS)',
    fieldOfStudy: 'Computer Science',
    graduationDate: 'July 2026',
    grade: 'CGPA: 3.66 / 4.00',
    order: 1,
  },
  {
    institution: 'Aga Khan Higher Secondary School (AKHSS) Chitral',
    degree: 'FSc Pre-Engineering',
    fieldOfStudy: 'Pre-Engineering Sciences',
    graduationDate: 'Completed',
    grade: '',
    order: 2,
  },
];

const initialSkills = [
  // Frontend
  { name: 'React.js', category: 'Frontend', order: 1 },
  { name: 'JavaScript (ES6+)', category: 'Frontend', order: 2 },
  { name: 'HTML5 & CSS3', category: 'Frontend', order: 3 },
  { name: 'Bootstrap', category: 'Frontend', order: 4 },
  { name: 'Responsive Web Design', category: 'Frontend', order: 5 },

  // Backend
  { name: 'Node.js', category: 'Backend', order: 1 },
  { name: 'Express.js', category: 'Backend', order: 2 },
  { name: 'REST API Architecture', category: 'Backend', order: 3 },

  // Database
  { name: 'MongoDB & Mongoose', category: 'Database', order: 1 },
  { name: 'MySQL & Relational SQL', category: 'Database', order: 2 },

  // Programming
  { name: 'JavaScript', category: 'Programming', order: 1 },
  { name: 'C++', category: 'Programming', order: 2 },
  { name: 'Python (Foundations)', category: 'Programming', order: 3 },

  // Tools
  { name: 'Git & GitHub', category: 'Tools', order: 1 },
  { name: 'VS Code', category: 'Tools', order: 2 },

  // Cybersecurity
  { name: 'Google Cybersecurity Certificate', category: 'Cybersecurity', order: 1 },
  { name: 'OWASP Security Fundamentals', category: 'Cybersecurity', order: 2 },
  { name: 'Vulnerability Assessment & Hardening', category: 'Cybersecurity', order: 3 },
  { name: 'Network Protocol & Packet Analysis', category: 'Cybersecurity', order: 4 },
];

const seedProfileData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI missing from .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Profile] Connected to MongoDB');

    // Seed Experiences
    for (const exp of initialExperiences) {
      const exists = await Experience.findOne({ company: exp.company, role: exp.role });
      if (!exists) {
        await Experience.create(exp);
        console.log(`[Seed Profile] Added Experience: ${exp.company}`);
      }
    }

    // Seed Education
    for (const edu of initialEducation) {
      const exists = await Education.findOne({ institution: edu.institution, degree: edu.degree });
      if (!exists) {
        await Education.create(edu);
        console.log(`[Seed Profile] Added Education: ${edu.institution}`);
      }
    }

    // Seed Skills
    for (const skill of initialSkills) {
      const exists = await Skill.findOne({ name: skill.name, category: skill.category });
      if (!exists) {
        await Skill.create(skill);
      }
    }
    console.log('[Seed Profile] Technical skills verified.');

    console.log('[Seed Profile] Profile data seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Profile Error] ${err.message}`);
    process.exit(1);
  }
};

seedProfileData();