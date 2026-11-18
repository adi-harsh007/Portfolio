# Aditya Harsh — Cinematic Portfolio & Interactive Engineering Realm

A multi-experience portfolio engineered for **Aditya Harsh** (Full-Stack Software Engineer & Applied ML/AI practitioner, B.Tech Electronics & Computer Science Engineering, KIIT 2027).

Featuring a **Ghost of Yōtei-inspired AAA cinematic title screen**, a dedicated **Recruiter Dossier**, an **ATS-optimized Resume**, a **15+ Verified Honors & Certifications Gallery**, and an **Interactive 2D Side-Scrolling Game Realm**.

---

## ⛩️ Architecture & Route Map

```
Portfolio/
├── index.html                   # Ghost of Yōtei Cinematic Title Screen (Crimson Twilight)
├── recruiter.html               # Executive Recruiter Dossier (1-Page Minimal Summary)
├── resume.html                  # ATS-Optimized Curriculum Vitae & Printable Sheet
├── certifications.html          # Verified Credentials Gallery (15+ Certificates with Lightbox)
├── game.html                    # 2D Side-Scrolling Interactive Game World
│
├── package.json                 # Project configuration (Zero external dependencies)
├── server.js                    # Built-in Node preview server (Auto-opens http://localhost:3000)
├── README.md                    # Project documentation
│
├── certificates/                # Authentic Credentials, Badges & Official PDFs
│   ├── aditya-harsh-resume.pdf  # Official Resume PDF (B.Tech ECSE, KIIT '27, CGPA 7.10)
│   ├── internship-am-thermopack.pdf # A.M. Thermopack Database Developer Internship Letter
│   ├── internship-am-thermopack.png # High-res horizontal certificate image
│   ├── ibm-coursera-genai.pdf   # IBM Generative AI Essentials Certificate
│   ├── ibm-coursera-genai.png   # High-res certificate preview image
│   ├── android-dev-badges.jpeg  # Google Developers Program (23 accredited Android badges)
│   ├── fcc-machine-learning.png # freeCodeCamp Machine Learning with Python (~300 hrs)
│   ├── fcc-data-analysis.png    # freeCodeCamp Data Analysis with Python (~300 hrs)
│   ├── fcc-javascript-dsa.png   # freeCodeCamp JavaScript Algorithms & Data Structures (~300 hrs)
│   ├── fcc-responsive-web-design.png # freeCodeCamp Responsive Web Design (~300 hrs)
│   ├── w3schools-mongodb-developer.png # W3Schools Certified MongoDB Developer (Professional)
│   ├── scaler-deep-learning.png # Scaler Deep Learning Deep Dive
│   ├── scaler-supervised-ml.png # Scaler Supervised Machine Learning (119 lessons)
│   ├── scaler-unsupervised-ml.png # Scaler Unsupervised Machine Learning
│   ├── scaler-react.png         # Scaler React JS Course
│   ├── scaler-sql-mysql.png     # Scaler SQL for Beginners & Database Design
│   ├── cursa-aws-serverless.png # Cursa AWS Serverless Framework
│   ├── cursa-python-fastapi.png # Cursa Python FastAPI
│   └── cursa-python-flask.png   # Cursa Flask with Python
│
├── css/
│   ├── yotei.css                # Ghost of Yōtei cinematic styling, blade slash animations & embers
│   └── styles.css               # 2D game retro HUD, tactile 3D buttons, neon glows & bento cards
│
└── js/
    ├── landing/                 # Ghost of Yōtei Title Screen Engines
    │   ├── canvas.js            # Mount Yōtei volcano cone, ronin silhouette, cloth physics & leaves
    │   ├── audio.js             # Web Audio API synthesizers (Wind, Koto, Katana slash, Taiko drum)
    │   └── landing.js           # Keyboard shortcuts (1-4, W/S), hover effects & page transitions
    │
    ├── config/
    │   └── data.js              # Grounded resume & engineering data (5 realms, objects, projects, skills)
    ├── core/
    │   ├── state.js             # Centralized state model (realms, player physics, Verlet cloth nodes)
    │   └── gameAudio.js         # Procedural Japanese Web Audio engine (wind, footsteps, koto, taiko)
    ├── game/
    │   ├── avatar.js            # Samurai Ronin sprite with Verlet cloth cape, kasa hat, and animations
    │   ├── camera.js            # Smooth lerp tracking camera with realm bounds and screen shake
    │   ├── physics.js           # Platformer physics, gravity, jump, ground collision, Verlet cloth physics
    │   ├── objects.js           # Torii shrines, ancient scrolls, and glowing momiji maple leaves
    │   ├── transitions.js       # Cinematic Japanese crimson mist & ink wash realm transitions
    │   ├── engine.js            # 60fps render loop, multi-layer compositing, and viewport management
    │   └── realms/              # 5 dedicated environmental realms
    │       ├── realmMountain.js # Realm 0: The Mountain Path (KIIT foundation & origin)
    │       ├── realmGarden.js   # Realm 1: The Healer's Garden (DermaScope Triage ML)
    │       ├── realmFestival.js # Realm 2: The Festival Grounds (Eventify Pro Concurrency)
    │       ├── realmVault.js    # Realm 3: The Merchant's Vault (MediStore DevOps & HMAC)
    │       └── realmSummit.js   # Realm 4: The Yōtei Summit (A.M. Thermopack, Skills, Contact)
    └── ui/
        ├── gameHud.js           # Minimalist floating HUD (realm title, momiji counter, audio toggle)
        ├── detailPanel.js       # Slide-in project drawer & live interactive sandboxes
        └── pauseMenu.js         # Samurai scroll pause menu (fast-travel & 90-sec guided journey)
```

---

## ⚡ Quick Start

Launch the zero-dependency local preview server:

```bash
npm start
```

Or run directly with Node:
```bash
node server.js
```

Open **`http://localhost:3000`** in any modern web browser.

---

## 🎮 Key Features

1. **Ghost of Yōtei Title Screen (`index.html`)**:
   - Canvas-rendered Mount Yōtei at Crimson Twilight.
   - Animated Ronin silhouette on a jagged cliff edge with procedural cloth and wind physics.
   - Swirling Japanese scarlet maple leaves (*momiji*) responding to mouse wind aerodynamics.
   - Real-time synthesized Web Audio (Mountain wind, Koto chords, Katana slice on hover, Taiko drum on select).
   - Instant keyboard navigation: `1` (Game), `2` (Dossier), `3` (Resume), `4` (Certs), `M` (Mute).

2. **Executive Recruiter Dossier (`recruiter.html`)**:
   - Tailored specifically for fast-paced technical hiring managers.
   - Highlights measurable engineering impact: **92.9% Melanoma Recall**, **50 req/s Row-Locking**, **15+ Certifications**, and **7.10 CGPA**.
   - Verified work experience at **A.M. Thermopack** as Database Developer Intern.

3. **ATS-Ready Resume (`resume.html`)**:
   - Clean, standardized format with single-click PDF download (`certificates/aditya-harsh-resume.pdf`).
   - Printer-friendly CSS stylesheet (`@media print`) for clean paper/PDF export.

4. **Honors & Verified Certifications (`certifications.html`)**:
   - Categorized by **AI & Machine Learning**, **Full-Stack & Web**, **Databases & Cloud**, and **Industry Internship**.
   - Interactive Lightbox inspection modal.
   - Direct verification links to Coursera, freeCodeCamp, W3Schools, and Cursa.

5. **"Path of the Ronin" 2D Samurai Game (`game.html`)**:
   - **5 Distinct Japanese Realms**: Mountain Path (Origin) → Healer's Garden (DermaScope) → Festival Grounds (Eventify) → Merchant's Vault (MediStore) → Yōtei Summit (Skills & Comms).
   - **Authentic Gameplay Loop**: Run (`A`/`D`), sprint (`Shift`), jump (`W`/`Space`), collect hidden golden/crimson *momiji* leaves, and inspect shrines (`E`).
   - **Dynamic Verlet Cloth Physics**: Ronin's crimson *haori* cloak and straw *kasa* hat ribbon react in real time to movement and mountain wind.
   - **Procedural Soundscape**: Authentic mountain wind, footstep gravel crunches, jump whooshes, resonant *Koto* plucks (Insen pentatonic scale), and *Taiko* boom strikes.
   - **Non-Intrusive Slide-In Project Drawer**: Inspecting shrines slides open a glassmorphism drawer featuring project metrics, architecture proofs, and embedded live interactive sandboxes (Grad-CAM scanner, 50 req/s concurrency burst test, HMAC webhook tamper test, and MySQL relational query console).
   - **Guided Journey**: 90-second automated recruiter walkthrough via the Samurai Scroll menu (`ESC`).
