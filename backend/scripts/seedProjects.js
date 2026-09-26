import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Project from '../src/models/Project.js';

const initialProjects = [
  {
    title: 'Elysium Stays — Luxury Serviced Accommodation Platform',
    slug: 'elysium-stays',
    shortDescription:
      'A production-ready full-stack MERN web application designed for luxury serviced apartment reservations in Islamabad, Pakistan. It includes server-authoritative price modeling, concurrency collision locking to prevent double bookings, cryptographic OTP authentication, and an administrative property management console.',
    fullDescription:
      'Elysium Stays is an end-to-end serviced apartment reservation platform. It was engineered to solve double-booking risks in hospitality booking through concurrency reservation locking and server-side price calculation pipelines.',
    problem:
      'Hospitality platforms often suffer from race conditions where two simultaneous users attempt to book the exact same unit for identical dates, as well as client-side tampering with price calculations.',
    solution:
      'Implemented optimistic concurrency locking at the database level paired with server-authoritative checkout calculation routes, ensuring data integrity across high-traffic booking windows.',
    keyFeatures: [
      'Server-authoritative price modeling preventing client tampering',
      'Concurrency collision locking to eliminate double reservations',
      'Cryptographic one-time password (OTP) email verification',
      'Comprehensive administrative property and booking management console',
      'Full-suite API verification using Supertest',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Tailwind CSS', 'Vite', 'Supertest'],
    role: 'Full Stack Architect & Lead Developer',
    category: 'Booking System',
    projectType: 'Personal Project',
    status: 'Completed',
    clientType: 'Hospitality / Serviced Apartments',
    thumbnail: {
      url: '',
      alt: 'Elysium Stays platform interface preview',
    },
    githubUrl: 'https://github.com/Yasir-Shah723/elysium-stays-booking-platform',
    liveDemoUrl: '',
    featured: true,
    published: true,
    seoTitle: 'Elysium Stays — Luxury Serviced Accommodation Booking System',
    seoDescription: 'Full-stack MERN luxury hospitality reservation platform with server-side validation and concurrency protection.',
  },
  {
    title: 'YasirMart — Full-Stack Multi-Vendor E-Commerce Platform',
    slug: 'yasirmart',
    shortDescription:
      'A production-grade, multi-vendor e-commerce marketplace built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Engineered with role-based access control (Customer, Seller, Admin), multi-image uploads, dynamic variant matrix, inventory deduction, and platform analytics.',
    fullDescription:
      'YasirMart is an architectural implementation of a multi-vendor digital store. It provides independent storefront controls for sellers while giving platform administrators global moderation and financial visibility.',
    problem:
      'Multi-vendor platforms require strict data isolation between vendors, complex product attribute matrices (size, color, stock per variant), and inventory concurrency during checkout.',
    solution:
      'Designed a multi-tier role-based authorization model, dedicated seller portal routes, dynamic variant stock matrices, and atomic MongoDB inventory deductions during order placement.',
    keyFeatures: [
      'Role-based access control (Customer, Seller, Platform Administrator)',
      'Multi-image product upload pipelines with cloud storage sync',
      'Dynamic product variant matrices (stock and pricing per variation)',
      'Atomic inventory deduction on confirmed checkout',
      'Dedicated seller management portal and revenue overview',
    ],
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS', 'JWT', 'Multer'],
    role: 'Full Stack Developer',
    category: 'E-Commerce',
    projectType: 'Personal Project',
    status: 'Completed',
    clientType: 'Multi-Vendor Retail Marketplace',
    thumbnail: {
      url: '',
      alt: 'YasirMart multi-vendor platform preview',
    },
    githubUrl: 'https://github.com/Yasir-Shah723/yasiro-fullstack-ecommerce-platform',
    liveDemoUrl: '',
    featured: true,
    published: true,
    seoTitle: 'YasirMart — Multi-Vendor E-Commerce Architecture',
    seoDescription: 'MERN stack multi-vendor marketplace featuring dynamic variant inventories and role-based permissions.',
  },
  {
    title: 'SmartCommunityHub',
    slug: 'smartcommunityhub',
    shortDescription:
      'A full-stack web platform that brings all community needs into one place. No more switching between multiple apps — everything your community needs is available in a single connected system.',
    fullDescription:
      'SmartCommunityHub unites essential neighborhood digital services into an integrated community portal, addressing citizen needs ranging from rental discovery to lost items and local service sharing.',
    problem:
      'Residents are forced to juggle disconnected groups, standalone forums, and social media pages for basic local services, leading to communication fragmentation and lost records.',
    solution:
      'Constructed a centralized web portal powered by a relational SQL backend, unifying civic modules into a cohesive interface with role-based moderation.',
    keyFeatures: [
      'Authentication and User Identity Management',
      'Rental Hub and Neighborhood Housing Listings',
      'Finance & Exchange and Donation/Reuse modules',
      'Skill Sharing and Peer-to-Peer Service Directory',
      'Smart Bazaar and Local Commerce Listing',
      'RideConnect Local Transit Coordination',
      'Job Matching and Career Path guidance',
      'Lost & Found registry and Citizen Complaint handling system',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MySQL', 'Bootstrap', 'REST APIs'],
    role: 'Full Stack Developer (Final Year Capstone Project)',
    category: 'Web Application',
    projectType: 'Academic / Capstone',
    status: 'Completed',
    clientType: 'Community & Civic Management',
    thumbnail: {
      url: '',
      alt: 'SmartCommunityHub portal overview',
    },
    githubUrl: 'https://github.com/Yasir-Shah723/my-fyp-project',
    liveDemoUrl: '',
    featured: true,
    published: true,
    seoTitle: 'SmartCommunityHub — Integrated Community Services Platform',
    seoDescription: 'Full-stack unified community web application built with React, Node.js, Express, and MySQL.',
  },
  {
    title: 'Todo App',
    slug: 'todo-app',
    shortDescription:
      'A full-stack to-do list application built with React, Node.js, Express, and MongoDB.',
    fullDescription:
      'A task management platform developed during internship coursework to demonstrate clean REST CRUD integration, schema modeling with Mongoose, and state synchronization across client and server.',
    problem:
      'Demonstrating core asynchronous CRUD data flows, validation pipelines, and persistent database state handling.',
    solution:
      'Built a decoupled MERN architecture with atomic state mutations on the client and strict payload validation on the server.',
    keyFeatures: [
      'Task creation, status toggling, modification, and deletion',
      'Real-time filter views (Active, Completed, All)',
      'Mongoose schema validation and error feedback',
      'Responsive design across devices',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'CSS3'],
    role: 'Full Stack Developer',
    category: 'Full Stack',
    projectType: 'Personal Project',
    status: 'Completed',
    clientType: 'Task Management Utility',
    thumbnail: {
      url: '',
      alt: 'Full stack Todo App interface',
    },
    githubUrl: 'https://github.com/Yasir-Shah723/RhombixTechnologies_Tasks_todoApp',
    liveDemoUrl: '',
    featured: false,
    published: true,
    seoTitle: 'Full-Stack Task Management Application',
    seoDescription: 'Clean MERN stack CRUD task management application demonstrating asynchronous state flows.',
  },
];

const seedProjects = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Projects] Connected to MongoDB');

    for (const projectData of initialProjects) {
      const existing = await Project.findOne({ slug: projectData.slug });
      if (existing) {
        console.log(`[Seed Projects] Exists: ${projectData.slug} (skipping)`);
      } else {
        const created = await Project.create(projectData);
        console.log(`[Seed Projects] Created: ${created.title} (${created.slug})`);
      }
    }

    console.log('[Seed Projects] Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Projects Error] ${err.message}`);
    process.exit(1);
  }
};

seedProjects();