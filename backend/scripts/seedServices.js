import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Service from '../src/models/Service.js';

const initialServices = [
  {
    title: 'Custom Business & Landing Pages',
    slug: 'business-websites',
    shortDescription: 'High-conversion, lightning-fast responsive websites tailored for local businesses, corporate brands, and professional practices.',
    deliverables: [
      'Responsive design across Mobile, Tablet, and Desktop',
      'Modern dark/light theme options',
      'SEO-optimized semantic HTML structure',
      'Lead capture forms and direct WhatsApp integration',
      'Clean performance scores and Core Web Vitals compliance',
    ],
    startingPrice: 120,
    priceType: 'starting_at',
    icon: 'Layout',
    category: 'Frontend',
    order: 1,
    active: true,
  },
  {
    title: 'Full-Stack MERN Web Applications',
    slug: 'mern-applications',
    shortDescription: 'Complete single-page web applications engineered with React, Node.js, Express, and MongoDB or MySQL database backends.',
    deliverables: [
      'Interactive single-page application (SPA) architecture',
      'Secure REST API endpoints and data models',
      'Authentication and role-based permissions (JWT / bcrypt)',
      'Database integration with indexing and data validation',
      'Responsive administrative management control panels',
    ],
    startingPrice: 350,
    priceType: 'starting_at',
    icon: 'Layers',
    category: 'Full Stack',
    order: 2,
    active: true,
  },
  {
    title: 'E-Commerce & Multi-Vendor Solutions',
    slug: 'ecommerce-websites',
    shortDescription: 'Scalable digital storefronts with catalog filtering, variant matrix management, cart synchronization, and order workflows.',
    deliverables: [
      'Product catalog with dynamic attributes and inventory tracking',
      'Customer authentication and profile order history',
      'Secure cart calculation and server-authoritative checkout',
      'Seller portal controls and administrative moderation dashboard',
    ],
    startingPrice: 500,
    priceType: 'custom_quote',
    icon: 'ShoppingCart',
    category: 'Full Stack',
    order: 3,
    active: true,
  },
  {
    title: 'Hotel & Serviced Booking Systems',
    slug: 'booking-systems',
    shortDescription: 'Specialized reservation platforms featuring concurrency locking to eliminate double bookings and server-side pricing engines.',
    deliverables: [
      'Date range calendar availability search',
      'Concurrency reservation locking preventing double bookings',
      'Server-authoritative invoice calculation',
      'Admin property, unit, and reservation calendar manager',
    ],
    startingPrice: 450,
    priceType: 'custom_quote',
    icon: 'Calendar',
    category: 'Full Stack',
    order: 4,
    active: true,
  },
  {
    title: 'REST API Design & Backend Architecture',
    slug: 'rest-apis-backend',
    shortDescription: 'Robust, documented backend APIs with rate limiting, input sanitization, centralized error handling, and database integration.',
    deliverables: [
      'Modular Express.js route and controller architecture',
      'JWT token validation and access control middleware',
      'Rate limiting, Helmet security headers, and CORS lockdown',
      'Schema modeling with Mongoose (MongoDB) or MySQL/Relational SQL',
    ],
    startingPrice: 200,
    priceType: 'starting_at',
    icon: 'Server',
    category: 'Backend & APIs',
    order: 5,
    active: true,
  },
  {
    title: 'Bug Fixing, Code Refactoring & Optimization',
    slug: 'bug-fixing-maintenance',
    shortDescription: 'Targeted resolution of frontend UI glitches, broken API integrations, database query bottlenecks, and authentication bugs.',
    deliverables: [
      'Rapid error identification and root cause diagnostics',
      'Frontend layout, React state, or hook re-render fixes',
      'Backend middleware, token, or CORS error resolution',
      'Codebase refactoring for maintainability and readability',
    ],
    startingPrice: 50,
    priceType: 'starting_at',
    icon: 'Bug',
    category: 'Maintenance & Support',
    order: 6,
    active: true,
  },
];

const seedServices = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Services] Connected to MongoDB');

    for (const serviceData of initialServices) {
      const existing = await Service.findOne({ slug: serviceData.slug });
      if (existing) {
        console.log(`[Seed Services] Exists: ${serviceData.slug} (skipping)`);
      } else {
        const created = await Service.create(serviceData);
        console.log(`[Seed Services] Created: ${created.title} (${created.slug})`);
      }
    }

    console.log('[Seed Services] Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Services Error] ${err.message}`);
    process.exit(1);
  }
};

seedServices();