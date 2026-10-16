/**
 * Projects data — three categories
 *
 * Edit this file to add, remove, or reorder projects.
 * - workingProjects: projects currently in progress
 * - completedProjects: shipped and finished projects
 * - selectedProjects: featured projects shown in "Selected Work"
 */

export type Project = {
  id: string;
  name: string;
  repo: string;
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

// ---- Working (in progress) ----

export const workingProjects: Project[] = [
  {
    id: "docbox",
    name: "DocBox",
    repo: "DocBox",
    blurb:
      "AI-powered PDF editor — annotate, summarize, and edit documents locally.",
    stack: ["React", "Python", "AI"],
    github: "https://github.com/Vijayapardhu/DocBox",
    accent: "#ef4444",
    kind: "browser",
    year: "2026",
    type: "AI PDF editor",
    highlights: ["AI summarization", "Local-first editing", "Annotation tools"],
  },
  {
    id: "mcp-agent",
    name: "MCP Agent",
    repo: "MCP-Agent",
    blurb:
      "AI agent built on the Model Context Protocol ecosystem for tool use and automation.",
    stack: ["TypeScript", "MCP", "AI Agents"],
    github: "https://github.com/Vijayapardhu/MCP-Agent",
    accent: "#8b5cf6",
    kind: "browser",
    year: "2026",
    type: "AI agent",
    highlights: ["Model Context Protocol", "Tool use", "Automation"],
  },
];

// ---- Completed (shipped) ----

export const completedProjects: Project[] = [
  {
    id: "echoroom",
    name: "EchoRoom",
    repo: "EchoRoom",
    blurb:
      "Real-time anonymous communication platform inspired by Omegle — instant text, voice & video chat with integrated screen sharing over peer-to-peer.",
    stack: ["React", "WebRTC", "Node.js", "Socket.IO"],
    live: "https://echoroom.online",
    github: "https://github.com/Vijayapardhu/EchoRoom",
    accent: "#6366f1",
    kind: "browser",
    year: "2025",
    type: "Real-time platform",
    highlights: ["Peer-to-peer WebRTC", "Live screen sharing", "Anonymous matchmaking"],
  },
  {
    id: "medi-advisor",
    name: "Medi Advisor",
    repo: "MediAdvisor",
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
    repo: "HeySara",
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
  {
    id: "campus-connect",
    name: "Campus Connect",
    repo: "Campus-Connect",
    blurb:
      "Copy on one laptop, paste on another. An encrypted, room-based clipboard and chat for devices on the same network — AES-256-GCM, no cloud, no account.",
    stack: ["Electron", "React", "TypeScript", "AES-256-GCM"],
    live: "https://www.cc.vijayaapardhu.dev/",
    github: "https://github.com/Vijayapardhu/Campus-Connect",
    accent: "#8b5cf6",
    kind: "browser",
    year: "2026",
    type: "Desktop app · LAN",
    highlights: ["End-to-end encrypted clipboard", "Room-based chat", "Works offline on local network"],
  },
  {
    id: "ipl-auction",
    name: "IPL Auction",
    repo: "ipl-auction",
    blurb:
      "Live IPL player auction platform — real-time bidding, team building, and auctioneer controls. Deployed on Vercel.",
    stack: ["JavaScript", "React", "Node.js"],
    live: "https://ipl-auction-liart.vercel.app",
    github: "https://github.com/Vijayapardhu/ipl-auction",
    accent: "#ef4444",
    kind: "browser",
    year: "2026",
    type: "Real-time auction",
    highlights: ["Live bidding", "Team management", "Auctioneer dashboard"],
  },
  {
    id: "truthly",
    name: "Truthly",
    repo: "truthly",
    blurb:
      "Verification and fact-checking platform to help users validate information and combat misinformation.",
    stack: ["TypeScript", "React"],
    live: "https://truthly-nine.vercel.app",
    github: "https://github.com/Vijayapardhu/truthly",
    accent: "#10b981",
    kind: "browser",
    year: "2026",
    type: "Fact-checking",
    highlights: ["Information verification", "Misinformation detection", "Vercel deployment"],
  },
  {
    id: "syncwave",
    name: "SyncWave",
    repo: "SyncWave",
    blurb:
      "Native Android app for syncing data across devices — built with Kotlin. Real-time synchronization with minimal latency.",
    stack: ["Kotlin", "Android"],
    github: "https://github.com/Vijayapardhu/SyncWave",
    accent: "#3b82f6",
    kind: "phone",
    year: "2026",
    type: "Android sync",
    highlights: ["Native Android build", "Real-time sync", "Cross-device data"],
  },
  {
    id: "get-it-done",
    name: "Get It Done",
    repo: "Get-It-Done",
    blurb:
      "Task and productivity app to organize your work, set priorities, and get things done.",
    stack: ["TypeScript", "React"],
    github: "https://github.com/Vijayapardhu/Get-It-Done",
    accent: "#f59e0b",
    kind: "browser",
    year: "2026",
    type: "Productivity",
    highlights: ["Task management", "Priority tracking", "TypeScript"],
  },
  {
    id: "eventhub",
    name: "EventHub",
    repo: "EventHub",
    blurb:
      "Full-stack web application for creating, viewing, and RSVPing to events. Built with the MERN stack.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    github: "https://github.com/Vijayapardhu/EventHub",
    accent: "#ec4899",
    kind: "browser",
    year: "2025",
    type: "MERN full-stack",
    highlights: ["Event creation", "RSVP system", "MERN stack"],
  },
  {
    id: "cc-cam",
    name: "cc-cam",
    repo: "cc-cam",
    blurb: "Camera and media utility project.",
    stack: [],
    github: "https://github.com/Vijayapardhu/cc-cam",
    accent: "#6366f1",
    kind: "browser",
    year: "2026",
    type: "Media utility",
    highlights: ["Latest project", "GitHub source"],
  },
];

// ---- Selected (featured in "Selected Work") ----

export const selectedProjects: Project[] = [
  completedProjects.find((p) => p.id === "echoroom")!,
  completedProjects.find((p) => p.id === "medi-advisor")!,
  completedProjects.find((p) => p.id === "hey-sara")!,
  completedProjects.find((p) => p.id === "campus-connect")!,
  completedProjects.find((p) => p.id === "ipl-auction")!,
  completedProjects.find((p) => p.id === "truthly")!,
];
