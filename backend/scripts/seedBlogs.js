import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Blog from '../src/models/Blog.js';

const initialBlogs = [
  {
    title: 'Preventing Double Bookings in MERN Hospitality Platforms',
    slug: 'preventing-double-bookings-mern',
    summary:
      'How to eliminate race conditions and double reservations in full-stack web applications using optimistic concurrency locking and server-authoritative date verification.',
    content: `When engineering reservation platforms like Elysium Stays, concurrency collisions are among the most critical edge cases. A concurrency collision occurs when two independent clients select the identical dates for the exact same accommodation unit within milliseconds of each other.

If a developer relies on naive frontend state or straightforward sequential lookups without database-level concurrency control, both reservations can write to the database simultaneously—resulting in an immediate double booking disaster.

### 1. The Core Problem: Asynchronous Race Conditions
Consider this naive implementation:
1. User A checks date availability for Unit 1: Available.
2. User B checks date availability for Unit 1: Available.
3. User A sends payment and clicks "Confirm Reservation".
4. User B sends payment and clicks "Confirm Reservation".
5. Both records insert successfully because the availability check happened before either write committed.

### 2. The Architectural Solution
To eliminate double bookings, we introduce a two-phase concurrency safeguard:
- **Server-Authoritative Validation:** The frontend never decides if dates are free or what the total price is. Every price calculation is computed strictly on the backend using immutable date-diffing pipelines.
- **Atomic Locking & Date Conflict Querying:** Before creating the reservation document, we execute an atomic MongoDB query that tests whether any confirmed reservation overlaps with the requested interval:
  \`\`\`javascript
  const hasConflict = await Reservation.findOne({
    unitId,
    status: { $ne: 'cancelled' },$or: [
      { checkIn: { $lt: reqCheckOut }, checkOut: {$gt: reqCheckIn } }
    ]
  });
  \`\`\`
- **Database Unique Composite Indices:** For discrete daily slot models, a unique index on \`{ unitId: 1, reservationDate: 1 }\` enforces physical database rejection of colliding writes.

By shifting validation entirely to the server and implementing atomic overlap queries, the platform remains resilient under high-concurrency booking spikes.`,
    category: 'MERN Stack',
    tags: ['MongoDB', 'Express', 'Concurrency', 'Node.js'],
    published: true,
  },
  {
    title: 'Essential Web Security Practices for Junior Full-Stack Developers',
    slug: 'essential-web-security-practices',
    summary:
      'A practical guide to securing Node.js and Express REST APIs against common vulnerabilities: rate limiting, HTTP security headers, and input sanitization.',
    content: `Building web applications that function properly is only half the engineering requirement. As modern web threats grow increasingly automated, building secure defaults into your backend architecture from day one is non-negotiable.

During my study for the Google Cybersecurity Professional Certificate, one foundational rule became clear: **Security is not an add-on feature at deployment; it is a foundational architectural choice.**

### 1. Secure HTTP Headers with Helmet
By default, Express.js advertises itself via the \`X-Powered-By: Express\` response header. This gives potential attackers instant information about your stack.
Using \`helmet\` automatically removes this banner, disables iframe clickjacking through \`X-Frame-Options\`, and enforces Strict Transport Security (HSTS).

### 2. Rate Limiting Authentication Endpoints
Credential-stuffing bots attempt thousands of username and password combinations per minute. Without rate limiting, an attacker can brute-force credentials uninterrupted.
By wrapping authentication routes with \`express-rate-limit\`, you limit IP requests to a sensible threshold (such as 5 attempts per 15 minutes), neutralizing brute-force scripts.

### 3. Separation of Sensitive Fields in Database Schemas
Never return password hashes in general database queries. In Mongoose, you should always mark credential fields with \`select: false\`:
\`\`\`javascript
password: {
  type: String,
  required: true,
  select: false
}
\`\`\`
When authentication requires the hash for comparison, explicitly opt-in using \`.select('+password')\` in the login controller. This prevents accidental exposure in user profile endpoints.`,
    category: 'Web Security',
    tags: ['Cybersecurity', 'Express', 'OWASP', 'Node.js'],
    published: true,
  },
  {
    title: 'Structuring Production-Ready REST APIs in Express.js',
    slug: 'structuring-production-ready-rest-apis',
    summary:
      'Why separating routes, controllers, and services matters for long-term code maintainability, testing, and team collaboration.',
    content: `When developers first learn Express.js, tutorials often place route definitions, database queries, and business logic into a single monolithic \`index.js\` or \`server.js\` file. While quick for prototyping, this pattern rapidly collapses as features expand.

### 1. Clean Separation of Concerns
In professional development, each layer of the application must have a singular, predictable responsibility:
- **Routes Layer (\`routes/\`):** Defines HTTP verbs and path endpoints. It applies security middlewares (auth checks, rate limiters) and passes execution to the corresponding controller.
- **Controllers Layer (\`controllers/\`):** Manages HTTP request and response cycles. It extracts parameters from \`req.body\` and \`req.params\`, calls model methods, and formats status codes (\`200\`, \`201\`, \`400\`, \`404\`).
- **Models Layer (\`models/\`):** Defines the data schema, constraints, data types, indexes, and lifecycle hooks using an ODM like Mongoose.
- **Middleware Layer (\`middleware/\`):** Intercepts requests for authentication tokens, validation schemas, or central error logging.

### 2. Centralized Error Handling
Instead of wrapping every asynchronous route in duplicate \`try/catch\` blocks with random error shapes, route all runtime errors to a single Express error handler middleware.
By standardizing operational errors via a custom \`AppError\` class, your API guarantees consistent JSON error contracts across all endpoints:
\`\`\`json
{
  "success": false,
  "status": "fail",
  "message": "Resource not found"
}
\`\`\`
This predictable contract makes frontend integration effortless.`,
    category: 'Software Engineering',
    tags: ['Architecture', 'REST API', 'Express', 'Clean Code'],
    published: true,
  },
];

const seedBlogs = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed Blogs] Connected to MongoDB');

    for (const blogData of initialBlogs) {
      const existing = await Blog.findOne({ slug: blogData.slug });
      if (existing) {
        console.log(`[Seed Blogs] Exists: ${blogData.slug} (skipping)`);
      } else {
        const created = await Blog.create(blogData);
        console.log(`[Seed Blogs] Created: ${created.title} (${created.slug})`);
      }
    }

    console.log('[Seed Blogs] Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Blogs Error] ${err.message}`);
    process.exit(1);
  }
};

seedBlogs();