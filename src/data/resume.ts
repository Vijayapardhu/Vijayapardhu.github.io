// Single source of truth — extracted from Vijaya Pardhu's résumé.

export const profile = {
  name: "Magapu Vijaya Pardhu",
  first: "Vijaya Pardhu",
  roles: ["Software Engineer", "Full Stack Developer", "Flutter Developer"],
  tagline:
    "I'm a developer from Kakinada. I take apps from a rough sketch all the way to the Play Store — for real clients, not just side projects.",
  location: "Kakinada, Andhra Pradesh, India",
  phone: "+91 9494429963",
  email: "vijaypardhu17@gmail.com",
  summary:
    "I did a diploma in computer engineering, then jumped into B.Tech CS through lateral entry — but most of what I actually know came from building and breaking real things. For the last six months I've been at Knight21 Digital Hub shipping production apps for real clients: Flutter on mobile, React and Laravel on the web, all deployed to Linux VPS and the Play Store. I use Claude and Gemini every day to move faster, but I own every decision that ships.",
  links: {
    github: "https://github.com/vijayapardhu",
    linkedin: "https://linkedin.com/in/vijayaapardhu",
    site: "https://vijayapardhu.github.io",
  },
} as const;

export type Project = {
  id: string;
  name: string;
  blurb: string;
  stack: string[];
  live?: string;
  github?: string;
  accent: string;
  kind: "browser" | "phone";
  year: string;
  type: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    id: "echoroom",
    name: "EchoRoom",
    blurb:
      "Real-time anonymous communication platform inspired by Omegle — instant text, voice & video chat with integrated screen sharing over peer-to-peer.",
    stack: ["React", "WebRTC", "Node.js", "Socket.IO"],
    live: "https://echoroom.online",
    accent: "#6366f1",
    kind: "browser",
    year: "2025",
    type: "Real-time platform",
    highlights: ["Peer-to-peer WebRTC", "Live screen sharing", "Anonymous matchmaking"],
  },
  {
    id: "medi-advisor",
    name: "Medi Advisor",
    blurb:
      "AI-powered healthcare platform that predicts diseases from symptoms and suggests medicines using Gemini AI.",
    stack: ["React", "Gemini AI", "Vercel"],
    live: "https://medi-advisor.vercel.app",
    github: "https://github.com/Vijayapardhu/MediAdvisor",
    accent: "#10b981",
    kind: "browser",
    year: "2025",
    type: "AI healthcare",
    highlights: ["Symptom → disease model", "Gemini-powered advice", "Instant deployment"],
  },
  {
    id: "hey-sara",
    name: "Hey Sara",
    blurb:
      "Fully offline Android smart assistant inspired by Google Assistant — wake-word detection with Porcupine, voice commands & API integrations, built from scratch.",
    stack: ["Java", "Android", "Porcupine SDK"],
    live: "https://heysara-assistant.vercel.app",
    github: "https://github.com/Vijayapardhu/HeySara",
    accent: "#f59e0b",
    kind: "phone",
    year: "2024",
    type: "Offline assistant",
    highlights: ["On-device wake word", "Zero-network privacy", "Native Android build"],
  },
];

// Core competencies → a "How I work" grid
export const capabilities = [
  { k: "Full-Stack Web", d: "React and Laravel — I build the screens, the API and the database, not just one slice of it." },
  { k: "Mobile Apps", d: "Flutter and native Android. My apps are live on the Play Store, not stuck in a demo folder." },
  { k: "Backend & APIs", d: "REST APIs, auth and data on PostgreSQL, MySQL and Firebase — the parts users never see but always feel." },
  { k: "Deploying it myself", d: "I set up and ship on Linux VPS, Vercel and the app stores on my own — no hand-off." },
  { k: "Thinking it through", d: "I figure out how a thing should be built before I start typing. Saves a lot of rewrites." },
  { k: "Building with AI", d: "Claude and Gemini are in the loop every day. Faster — but it's still my call on what actually ships." },
];

export const softSkills = [
  "Problem Solving", "Critical Thinking", "Communication", "Leadership",
  "Team Collaboration", "Time Management", "Adaptability", "Fast Learning", "Project Ownership",
];

export const languages = ["English", "Telugu"];

export const quickFacts = [
  { k: "Based in", v: "Kakinada, Andhra Pradesh" },
  { k: "Studying", v: "B.Tech CSE · Aditya University" },
  { k: "Focus", v: "Flutter · Full-Stack · AI" },
  { k: "Availability", v: "Open to internships & freelance" },
];

// Honest, first-person bits
export const personal = {
  currently: [
    { k: "Building", v: "DocBox — an AI PDF editor" },
    { k: "Learning", v: "AI agents & the MCP ecosystem" },
    { k: "Studying", v: "B.Tech CS at Aditya University" },
    { k: "Running on", v: "Filter coffee & late-night commits" },
  ],
  signOff: "Thanks for scrolling all the way down.",
};

export const experience = {
  role: "Software Engineer",
  company: "Knight21 Digital Hub",
  duration: "6 Months",
  points: [
    "Developed cross-platform mobile applications using Flutter.",
    "Integrated frontend applications with REST APIs and backend services.",
    "Managed PostgreSQL, MySQL, and Firebase databases.",
    "Configured and deployed applications on Linux VPS servers.",
    "Published Android apps on Google Play Store; participated in iOS App Store submission.",
    "Used AI dev tools (Claude, Gemini) to accelerate delivery.",
    "Collaborated with clients to build scalable, production-ready software.",
  ],
};

export const skills = {
  Languages: ["Java", "Python", "PHP", "JavaScript", "SQL", "Dart", "HTML5", "CSS3"],
  Frameworks: ["Flutter", "React", "Laravel", "Django", "Firebase", "REST APIs"],
  Databases: ["PostgreSQL", "MySQL", "Realtime DB", "Firestore"],
  Tools: ["Git", "GitHub", "Android Studio", "VS Code", "Postman", "Linux VPS", "Vercel", "Claude AI"],
};

export const timeline = [
  {
    year: "2026 – 2029",
    title: "B.Tech, Computer Science & Engineering",
    org: "Aditya University (Lateral Entry)",
  },
  {
    year: "2023 – 2026",
    title: "Diploma in Computer Engineering",
    org: "Aditya College of Engineering · APSBTET · CGPA 7.9/10",
  },
  {
    year: "6 Months",
    title: "Software Engineer",
    org: "Knight21 Digital Hub",
  },
];

export const certifications = [
  "Web Development — TechMind IT Solutions (2026)",
  "Python Full Stack Development — TechMind IT Solutions (2026)",
  "Scientific Computing with Python — freeCodeCamp (2026)",
];

export const stats = [
  { to: 3, suffix: "", label: "Apps I've shipped" },
  { to: 6, suffix: " mo", label: "Building for real clients" },
  { to: 8, suffix: "+", label: "Languages & frameworks" },
  { to: 3, suffix: "", label: "Certifications earned" },
];

export const marquee = [
  "Flutter", "React", "Laravel", "Django", "Firebase", "PostgreSQL", "MySQL",
  "Node.js", "WebRTC", "Java", "Python", "PHP", "Dart", "Linux VPS", "Vercel", "Gemini",
];

export const nowBuilding = ["DocBox — AI PDF Editor", "Flutter", "Laravel", "AI Agents · MCP"];

export const quotes = [
  "Ship it, then make it better.",
  "The best code is the code you didn't have to write.",
  "AI-assisted, human-directed.",
  "Offline-first is a feature, not a constraint.",
  "From idea to Play Store — no step skipped.",
  "Constraints breed creativity.",
];
