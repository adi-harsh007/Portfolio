/**
 * Grounded Portfolio Data (Aditya Harsh - Full-Stack & Applied ML/AI)
 * "Path of the Ronin" 5-Realm World Model & Grounded Proof Points
 */

export const REALMS = [
  {
    id: 'mountain',
    index: 0,
    title: 'The Mountain Path',
    kanji: '霊山への道',
    subtitle: 'Where the journey begins — KIIT B.Tech foundation & the engineer\'s vow.',
    width: 2800,
    sky: { top: '#0a0304', mid: '#24080c', bottom: '#421217' },
    accent: '#f59e0b',
    secondary: '#fb7185',
    theme: 'twilight'
  },
  {
    id: 'garden',
    index: 1,
    title: "The Healer's Garden",
    kanji: '医術の庭',
    subtitle: 'DermaScope Triage — PyTorch EfficientNet-B3, Mahalanobis OOD gate & Grad-CAM diagnostics.',
    width: 3000,
    sky: { top: '#050a08', mid: '#0d221c', bottom: '#16382e' },
    accent: '#fb7185',
    secondary: '#34d399',
    projectKey: 'dermascope',
    theme: 'bioluminescent'
  },
  {
    id: 'festival',
    index: 2,
    title: 'The Festival Grounds',
    kanji: '宵祭の広場',
    subtitle: 'Eventify Pro — React 19, PostgreSQL row locking (SELECT ... FOR UPDATE), Redis cache & Gemini 2.5 Flash.',
    width: 3200,
    sky: { top: '#0c0718', mid: '#1e1138', bottom: '#361d5a' },
    accent: '#a78bfa',
    secondary: '#38bdf8',
    projectKey: 'eventify',
    theme: 'lanterns'
  },
  {
    id: 'vault',
    index: 3,
    title: "The Merchant's Vault",
    kanji: '商人の宝物庫',
    subtitle: 'MediStore — Express 5, PostgreSQL 16, Docker Compose, Cloudinary Rx & HMAC-SHA256 Razorpay verification.',
    width: 3000,
    sky: { top: '#041014', mid: '#08252d', bottom: '#113e47' },
    accent: '#34d399',
    secondary: '#38bdf8',
    projectKey: 'medistore',
    theme: 'vault'
  },
  {
    id: 'summit',
    index: 4,
    title: 'The Yōtei Summit',
    kanji: '羊蹄の頂',
    subtitle: 'The peak overlooking all realms — A.M. Thermopack MySQL foundry, 24 core skills & direct contact.',
    width: 3200,
    sky: { top: '#120205', mid: '#380a12', bottom: '#641520' },
    accent: '#fbbf24',
    secondary: '#f43f5e',
    projectKey: 'summit',
    theme: 'summit'
  }
];

// Interactive Objects Placed Across the 5 Realms
export const REALM_OBJECTS = [
  // -------------------------------------------------------------
  // REALM 0: MOUNTAIN PATH
  // -------------------------------------------------------------
  {
    id: 'r0_scroll_origin',
    realmIndex: 0,
    x: 520,
    type: 'scroll',
    icon: '📜',
    title: 'The Wanderer\'s Crest',
    subtitle: 'Aditya Harsh — Full-Stack Engineer & Applied ML/AI',
    summary: 'Final-year B.Tech in Electronics & Computer Science Engineering at KIIT University (2023–2027, CGPA: 7.10/10.0). Engineering robust web architectures with strict transaction isolation and calibrated deep learning models.',
    tag: 'ORIGIN'
  },
  {
    id: 'r0_leaf_1',
    realmIndex: 0,
    x: 820,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Discipline',
    skillUnlocked: 'Python & PyTorch'
  },
  {
    id: 'r0_scroll_kiit',
    realmIndex: 0,
    x: 1350,
    type: 'scroll',
    icon: '📜',
    title: 'Academy of Kalinga (KIIT)',
    subtitle: 'B.Tech Electronics & Computer Science (2023–2027)',
    summary: 'Coursework: Data Structures & Algorithms, Database Management Systems (DBMS), Object-Oriented Programming (OOP), Computer Networks, Machine Learning Foundations. Class XII: 81% (CBSE) | Class X: 81% (CBSE).',
    tag: 'EDUCATION'
  },
  {
    id: 'r0_leaf_2',
    realmIndex: 0,
    x: 1850,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Systems',
    skillUnlocked: 'TypeScript & React'
  },
  {
    id: 'r0_gate_exit',
    realmIndex: 0,
    x: 2500,
    type: 'shrine',
    icon: '⛩️',
    title: 'Torii Gate to the Healer\'s Garden',
    subtitle: 'Enter Realm 1 — DermaScope Triage AI Bay',
    actionText: 'Enter Healer\'s Garden',
    targetRealm: 1
  },

  // -------------------------------------------------------------
  // REALM 1: HEALER'S GARDEN (DermaScope Triage)
  // -------------------------------------------------------------
  {
    id: 'r1_scroll_model',
    realmIndex: 1,
    x: 550,
    type: 'scroll',
    icon: '📜',
    title: 'DermaScope Architecture',
    subtitle: 'EfficientNet-B3 + conv_head Grad-CAM',
    summary: 'Trained across 7 HAM10000 classes on a 1,503-image lesion-disjoint split. Achieved 80.9% accuracy, 0.712 macro-F1, and calibrated 0.0337 Expected Calibration Error (ECE) to eliminate false overconfidence.',
    tag: 'ML MODEL'
  },
  {
    id: 'r1_leaf_1',
    realmIndex: 1,
    x: 950,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Precision',
    skillUnlocked: 'Grad-CAM Explainability'
  },
  {
    id: 'r1_shrine_dermascope',
    realmIndex: 1,
    x: 1550,
    type: 'shrine',
    icon: '🔬',
    title: 'DermaScope Diagnostic Shrine',
    subtitle: 'Live Interactive Scanner: Grad-CAM + 2-Stage OOD Gate',
    projectKey: 'dermascope',
    actionText: 'Open Diagnostic Sandbox'
  },
  {
    id: 'r1_leaf_2',
    realmIndex: 1,
    x: 2100,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Safety',
    skillUnlocked: 'Mahalanobis OOD Defense'
  },
  {
    id: 'r1_gate_exit',
    realmIndex: 1,
    x: 2750,
    type: 'shrine',
    icon: '⛩️',
    title: 'Torii Gate to Festival Grounds',
    subtitle: 'Enter Realm 2 — Eventify Pro Command Center',
    actionText: 'Enter Festival Grounds',
    targetRealm: 2
  },

  // -------------------------------------------------------------
  // REALM 2: FESTIVAL GROUNDS (Eventify Pro)
  // -------------------------------------------------------------
  {
    id: 'r2_scroll_concurrency',
    realmIndex: 2,
    x: 600,
    type: 'scroll',
    icon: '📜',
    title: 'PostgreSQL Row-Locking Contract',
    subtitle: 'SELECT ... FOR UPDATE vs Overbooking',
    summary: 'Guaranteed atomic registration and seat allocation during flash surges. Eliminated negative capacity anomalies using strict row locks, coupled with cursor-based event pagination and 11ms Redis caching.',
    tag: 'CONCURRENCY'
  },
  {
    id: 'r2_leaf_1',
    realmIndex: 2,
    x: 1050,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Resilience',
    skillUnlocked: 'PostgreSQL Row Locking'
  },
  {
    id: 'r2_shrine_eventify',
    realmIndex: 2,
    x: 1680,
    type: 'shrine',
    icon: '⚡',
    title: 'Eventify Pro Festival Shrine',
    subtitle: 'Live Interactive Simulator: 50 Req/s Concurrency Burst & EventBot',
    projectKey: 'eventify',
    actionText: 'Open Concurrency Sandbox'
  },
  {
    id: 'r2_leaf_2',
    realmIndex: 2,
    x: 2280,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Speed',
    skillUnlocked: 'Redis Caching & Gemini API'
  },
  {
    id: 'r2_gate_exit',
    realmIndex: 2,
    x: 2950,
    type: 'shrine',
    icon: '⛩️',
    title: 'Torii Gate to Merchant\'s Vault',
    subtitle: 'Enter Realm 3 — MediStore Automated Pharmacy',
    actionText: 'Enter Merchant\'s Vault',
    targetRealm: 3
  },

  // -------------------------------------------------------------
  // REALM 3: MERCHANT'S VAULT (MediStore)
  // -------------------------------------------------------------
  {
    id: 'r3_scroll_security',
    realmIndex: 3,
    x: 580,
    type: 'scroll',
    icon: '📜',
    title: 'Cryptographic Integrity & Docker Stack',
    subtitle: 'HMAC-SHA256 Razorpay Webhooks + Docker PG16',
    summary: 'Enforced server-side pricing recalculation and stock decrement before payment link creation. Razorpay callbacks validated via HMAC-SHA256 signatures, preventing price tampering. Multi-service Docker Compose stack.',
    tag: 'DEVOPS & SECURITY'
  },
  {
    id: 'r3_leaf_1',
    realmIndex: 3,
    x: 1000,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Fortress',
    skillUnlocked: 'HMAC-SHA256 & Docker'
  },
  {
    id: 'r3_shrine_medistore',
    realmIndex: 3,
    x: 1620,
    type: 'shrine',
    icon: '🛡️',
    title: 'MediStore Vault Shrine',
    subtitle: 'Live Interactive Simulator: Webhook Tamper Attack & Docker Stack',
    projectKey: 'medistore',
    actionText: 'Open Security Sandbox'
  },
  {
    id: 'r3_leaf_2',
    realmIndex: 3,
    x: 2150,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Commerce',
    skillUnlocked: 'Express 5 & Prisma ORM'
  },
  {
    id: 'r3_gate_exit',
    realmIndex: 3,
    x: 2780,
    type: 'shrine',
    icon: '⛩️',
    title: 'Ascend to the Yōtei Summit',
    subtitle: 'Enter Realm 4 — Skills Constellation & Direct Comms',
    actionText: 'Ascend to Summit',
    targetRealm: 4
  },

  // -------------------------------------------------------------
  // REALM 4: THE YŌTEI SUMMIT (Skills, Thermopack, Honors, Contact)
  // -------------------------------------------------------------
  {
    id: 'r4_scroll_thermopack',
    realmIndex: 4,
    x: 620,
    type: 'scroll',
    icon: '🗄️',
    title: 'A.M. Thermopack — Database Developer Intern',
    subtitle: 'Faridabad, India (May – June 2024)',
    summary: 'Replaced fragmented spreadsheet data silos by designing a normalized 3NF MySQL relational schema consolidating 500+ operational records (customers, payments, production batches, prospects). Built search admin tooling for non-technical warehouse operators.',
    tag: 'INTERNSHIP'
  },
  {
    id: 'r4_leaf_1',
    realmIndex: 4,
    x: 1080,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Relations',
    skillUnlocked: 'MySQL Normalization (3NF)'
  },
  {
    id: 'r4_shrine_skills',
    realmIndex: 4,
    x: 1720,
    type: 'shrine',
    icon: '⚔️',
    title: 'The Great Skill Constellation',
    subtitle: 'Inspect & Equip Aditya\'s 24 Technical Weapons Across 6 Classes',
    projectKey: 'skills',
    actionText: 'Open Skill Forge & Arsenal'
  },
  {
    id: 'r4_scroll_contact',
    realmIndex: 4,
    x: 2360,
    type: 'scroll',
    icon: '📬',
    title: 'Direct Dispatch to Aditya',
    subtitle: 'Open for 2027 SWE, Full-Stack & Applied ML Roles',
    summary: 'Email: adiharsh94@gmail.com | Phone: +91 6201633256 | GitHub: github.com/adi-harsh007 | LinkedIn: linkedin.com/in/aditya-harsh-b1738126a',
    tag: 'CONTACT'
  },
  {
    id: 'r4_leaf_2',
    realmIndex: 4,
    x: 2750,
    type: 'leaf',
    icon: '🍁',
    title: 'Momiji of Mastery',
    skillUnlocked: 'Complete Arsenal Mastery'
  }
];

// Project Detailed Specifications for Slide-In Detail Panel
export const PROJECT_DETAILS = {
  dermascope: {
    title: 'DermaScope Triage — Explainable Skin Lesion Classification',
    category: 'Applied ML & Backend Inference',
    repoUrl: 'https://github.com/adi-harsh007/Dermascope-triage',
    liveUrl: null,
    metrics: [
      { label: 'Hold-Out Accuracy', val: '80.9%', desc: '1,503 Lesion-Disjoint' },
      { label: 'Macro-F1 Score', val: '0.712', desc: 'Across 7 HAM10000 classes' },
      { label: 'Calibration (ECE)', val: '0.0337', desc: 'No false overconfidence' },
      { label: 'Melanoma Recall', val: '92.9%', desc: 'At 23.6% review rate' }
    ],
    stack: ['Python', 'PyTorch', 'EfficientNet-B3', 'FastAPI', 'SQLAlchemy', 'Grad-CAM', 'pytest', 'SQLite'],
    bullets: [
      'Trained an <strong>EfficientNet-B3</strong> classifier across 7 HAM10000 classes using a strict <strong>1,503-image lesion-disjoint hold-out split</strong>, avoiding patient identity data leakage.',
      'Engineered a <strong>two-stage Out-Of-Distribution (OOD) gate</strong>: Stage 1 checks illumination-invariant image color statistics; Stage 2 checks Mahalanobis distance in conv_head feature space (threshold > 3.50).',
      'Extracted <strong>Grad-CAM visual attribution heatmaps</strong> on the final convolutional layer, exposing clinical attention patterns for dermatological validation.',
      'Calibrated prediction probabilities via temperature scaling to achieve <strong>0.0337 ECE</strong>, preventing dangerous overconfidence in ambiguous lesion borders.'
    ]
  },

  eventify: {
    title: 'Eventify Pro — Event Management & AI Assistant Platform',
    category: 'Full-Stack Architecture & Concurrency',
    repoUrl: 'https://github.com/adi-harsh007/Eventify-Pro',
    liveUrl: 'https://eventify-pro.vercel.app',
    metrics: [
      { label: 'Registration Concurrency', val: 'Zero Overbooking', desc: 'SELECT ... FOR UPDATE' },
      { label: 'Redis Cache Hit Latency', val: '11ms', desc: 'Graceful Supabase fallback' },
      { label: 'AI Assistant', val: 'Gemini 2.5', desc: 'Rate-limited EventBot' },
      { label: 'Auth Protocols', val: 'JWT + OAuth 2.0', desc: '6-digit OTP email lock' }
    ],
    stack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL (Supabase)', 'Redis', 'Google Gemini', 'Framer Motion'],
    bullets: [
      'Engineered full-stack event platform with two-role RBAC (attendees & admins), <strong>JWT + Google OAuth 2.0</strong>, and 6-digit OTP email verification with brute-force rate locking.',
      'Implemented concurrency-safe registrations and team-capacity reservations via <strong>PostgreSQL row-level locking (<code>SELECT ... FOR UPDATE</code>)</strong>, completely eliminating race conditions.',
      'Architected cursor-based event discovery pagination paired with <strong>Redis memory caching</strong>, achieving 11ms read latency with automated Postgres failover.',
      'Integrated <strong>Google Gemini (gemini-2.5-flash)</strong> for the rate-limited EventBot assistant and AI description generator.'
    ]
  },

  medistore: {
    title: 'MediStore — Medical E-Commerce Platform',
    category: 'Full-Stack & DevOps Engineering',
    repoUrl: 'https://github.com/adi-harsh007/MediStore',
    liveUrl: 'https://medi-store-8eu3.vercel.app',
    metrics: [
      { label: 'Payment Verification', val: 'HMAC-SHA256', desc: 'Razorpay webhook signatures' },
      { label: 'Containerization', val: 'Docker Compose', desc: 'React + Express 5 + PG16' },
      { label: 'ORM Architecture', val: 'Prisma ORM', desc: 'Transactional safety' },
      { label: 'Asset Pipeline', val: 'Multer + Cloudinary', desc: 'Prescription upload vault' }
    ],
    stack: ['React 18', 'Node.js', 'Express 5', 'PostgreSQL 16', 'Prisma ORM', 'Docker Compose', 'Razorpay', 'Cloudinary'],
    bullets: [
      'Developed a high-reliability pharmacy storefront and <strong>Express 5 / Prisma REST API</strong> with backend-paginated catalog search, persistent cart/wishlist, and verified reviews.',
      'Enforced strict server-side order price re-calculation and stock decrement prior to invoice generation, verifying <strong>Razorpay payments via cryptographic HMAC-SHA256 signatures</strong>.',
      'Secured endpoints with JWT, bcrypt hashing, Google OAuth, Helmet headers, and rate limiting; containerized the complete stack with <strong>Docker Compose</strong>.'
    ]
  },

  skills: {
    title: 'Technical Arsenal & Skill Constellation',
    category: '24 Core Weapons Across 6 Engineering Classes',
    repoUrl: 'https://github.com/adi-harsh007',
    liveUrl: null,
    metrics: [
      { label: 'Total Verified Skills', val: '24 Skills', desc: 'Core & Advanced Tiers' },
      { label: 'Verified Honors', val: '15+ Certs', desc: 'IBM, freeCodeCamp, W3S' },
      { label: 'Live Sandboxes', val: '3 Projects', desc: 'Interactive simulators' },
      { label: 'Availability', val: 'Immediate', desc: '2027 SWE / ML Roles' }
    ],
    stack: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'React', 'FastAPI', 'Node.js', 'PyTorch', 'PostgreSQL', 'Docker'],
    bullets: [
      'Proficient in building end-to-end distributed systems and transactional architectures.',
      'Experienced in deep learning computer vision (EfficientNet-B3, Grad-CAM, Mahalanobis OOD detection).',
      'Strong computer science fundamentals: Data Structures & Algorithms, Object-Oriented Design, Concurrency Control, and Relational Database Normalization.'
    ]
  }
};

// Diagnostic telemetries for DermaScope live sandbox
export const DERMASCOPE_SAMPLES = [
  {
    id: 'case_mel',
    label: 'Case #104 — Malignant Melanoma (High Priority)',
    trueClass: 'Melanoma (MEL)',
    predictedClass: 'Melanoma (MEL)',
    confidence: 0.942,
    eceContribution: '0.0337 Global ECE',
    mahalanobisDist: 1.84,
    oodGateStatus: 'PASS (In-Distribution Clinical Dermoscopy)',
    triageAlert: 'URGENT CLINICAL REVIEW TRIGGERED (92.9% Recall Channel)',
    lesionColor: '#7f1d1d',
    borderColor: '#f43f5e',
    asymmetry: 0.88
  },
  {
    id: 'case_nv',
    label: 'Case #218 — Melanocytic Nevus (Benign)',
    trueClass: 'Melanocytic Nevus (NV)',
    predictedClass: 'Melanocytic Nevus (NV)',
    confidence: 0.916,
    eceContribution: '0.0337 Global ECE',
    mahalanobisDist: 1.42,
    oodGateStatus: 'PASS (In-Distribution Clinical Dermoscopy)',
    triageAlert: 'ROUTINE CONFIDENCE — NO ESCALATION NEEDED',
    lesionColor: '#78350f',
    borderColor: '#f59e0b',
    asymmetry: 0.22
  },
  {
    id: 'case_ood',
    label: 'Case #999 — Non-Clinical / OOD Artifact Sample',
    trueClass: 'Out-of-Distribution Input',
    predictedClass: 'BLOCKED BY TWO-STAGE OOD GATE',
    confidence: 0.0,
    eceContribution: 'Prevented False Overconfidence',
    mahalanobisDist: 7.95,
    oodGateStatus: 'REJECTED (Stage 1 Illumination + Stage 2 Mahalanobis > 3.50)',
    triageAlert: 'SAFEGUARD ENGAGED — FLAGGED FOR MANUAL CAPTURE RE-UPLOAD',
    lesionColor: '#1e293b',
    borderColor: '#38bdf8',
    asymmetry: 0.65
  }
];

// Normalized MySQL Records for A.M. Thermopack Foundry Sandbox
export const THERMOPACK_RECORDS = [
  { id: 'ORD-501', customer: 'Shree Balaji Packaging', city: 'Faridabad', product: '1200mm Bubble Roll (50kg)', qty: 45, paymentStatus: 'CLEARED', sqlTable: 'customers ⋈ production_quantities ⋈ payments' },
  { id: 'ORD-502', customer: 'Apex Auto Components', city: 'Gurugram', product: 'EPE Foam Sheet 10mm', qty: 120, paymentStatus: 'PENDING', sqlTable: 'customers ⋈ production_quantities ⋈ payments' },
  { id: 'ORD-503', customer: 'Noida Electronics Hub', city: 'Noida', product: 'Anti-Static ESD Pouch', qty: 800, paymentStatus: 'CLEARED', sqlTable: 'customers ⋈ production_quantities ⋈ payments' },
  { id: 'PROS-114', customer: 'Vardhman Logistics', city: 'Delhi NCR', product: 'Corrugated Roll Inquiry', qty: 200, paymentStatus: 'PROSPECT', sqlTable: 'prospective_customers' },
  { id: 'ORD-504', customer: 'Metro Pharma Supplies', city: 'Faridabad', product: 'Thermal Insulated Liner', qty: 65, paymentStatus: 'CLEARED', sqlTable: 'customers ⋈ production_quantities ⋈ payments' }
];

// Full 24 Skills Matrix
export const SKILLS_INVENTORY = [
  { id: 'py', name: 'Python', category: 'Languages', tier: 'Core', proof: 'PyTorch training pipeline, Mahalanobis OOD gate, FastAPI inference backend.' },
  { id: 'ts', name: 'TypeScript', category: 'Languages', tier: 'Core', proof: 'End-to-end type safety in Eventify Pro React 19 and API payload schemas.' },
  { id: 'js', name: 'JavaScript (ES6+)', category: 'Languages', tier: 'Core', proof: 'MediStore React 18 frontend, Express 5 REST controllers, Canvas 2D engine.' },
  { id: 'sql', name: 'SQL', category: 'Languages', tier: 'Core', proof: 'Normalized 3NF MySQL schema at A.M. Thermopack and Postgres row locks.' },
  { id: 'htmlcss', name: 'HTML5 / CSS3', category: 'Languages', tier: 'Core', proof: 'Modern responsive layouts, Canvas 2D rendering, design systems.' },
  { id: 'react', name: 'React (18 / 19)', category: 'Frontend', tier: 'Core', proof: 'Eventify Pro (React 19) and MediStore (React 18) with RBAC dashboards.' },
  { id: 'nextjs', name: 'Next.js & Vite', category: 'Frontend', tier: 'Advanced', proof: 'Fast bundlers, SPA/SSR architecture for low-latency Vercel deployments.' },
  { id: 'tailwind', name: 'Tailwind CSS (v4)', category: 'Frontend', tier: 'Core', proof: 'Zero-bloat design tokens and responsive dark-mode styling.' },
  { id: 'framer', name: 'Framer Motion & Radix UI', category: 'Frontend', tier: 'Advanced', proof: 'Accessible modal primitives and fluid UI animations.' },
  { id: 'node', name: 'Node.js & Express 5', category: 'Backend & DB', tier: 'Core', proof: 'Rate-limited, Helmet-secured REST APIs for MediStore and Eventify Pro.' },
  { id: 'fastapi', name: 'FastAPI', category: 'Backend & DB', tier: 'Core', proof: 'Asynchronous PyTorch inference service and Grad-CAM generation.' },
  { id: 'postgres', name: 'PostgreSQL (16 / Supabase)', category: 'Backend & DB', tier: 'Core', proof: 'SELECT ... FOR UPDATE row-level concurrency locking in Eventify Pro.' },
  { id: 'mysql', name: 'MySQL & SQLite', category: 'Backend & DB', tier: 'Core', proof: '3NF schema at A.M. Thermopack (500+ records) and SQLite scan logs in DermaScope.' },
  { id: 'redis', name: 'Redis', category: 'Backend & DB', tier: 'Advanced', proof: 'Sub-15ms event discovery caching with fallback to Supabase.' },
  { id: 'orm', name: 'Prisma ORM & SQLAlchemy', category: 'Backend & DB', tier: 'Core', proof: 'Transactional schema management in MediStore and scan audit logs.' },
  { id: 'pytorch', name: 'PyTorch & EfficientNet-B3', category: 'ML & AI', tier: 'Core', proof: '7-class lesion classifier (80.9% Acc, 0.712 F1, 1503 hold-out images).' },
  { id: 'gradcam', name: 'Grad-CAM & Calibration', category: 'ML & AI', tier: 'Core', proof: 'Extracted conv_head visual heatmaps and calibrated predictions to 0.0337 ECE.' },
  { id: 'ood', name: 'Mahalanobis OOD Defense', category: 'ML & AI', tier: 'Core', proof: 'Two-stage gate: color statistics + feature-space Mahalanobis distance checks.' },
  { id: 'gemini', name: 'Google Gemini API', category: 'ML & AI', tier: 'Core', proof: 'EventBot assistant and server-sanitized event description generator.' },
  { id: 'docker', name: 'Docker & Docker Compose', category: 'Tools & Cloud', tier: 'Core', proof: 'Containerized MediStore multi-container architecture (React + Express + PG16).' },
  { id: 'auth', name: 'JWT, OAuth 2.0 & OTP', category: 'Tools & Cloud', tier: 'Core', proof: 'Two-role RBAC, 6-digit OTP email verification, and bcrypt password hashing.' },
  { id: 'payments', name: 'Razorpay HMAC-SHA256', category: 'Tools & Cloud', tier: 'Core', proof: 'Cryptographic webhook signature verification and Multer/Cloudinary uploads.' },
  { id: 'testing', name: 'pytest, Git & CI/CD', category: 'Tools & Cloud', tier: 'Core', proof: 'Automated test suites, rollback scripts, and Vercel/Render workflows.' },
  { id: 'cs', name: 'DSA, OOP & DBMS', category: 'CS Fundamentals', tier: 'Core', proof: 'Rigorous foundation applied to transactional integrity and data models.' }
];
