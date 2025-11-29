import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full SkillJourney project data
export const skillJourneyProject: ProjectData = {
  id: "skilljourney",
  name: "SkillJourney",
  tagline: "AI-driven career roadmap generator creating personalized learning paths using Google's Gemini API.",
  category: "ML",
  year: "2024",
  links: {
    github: "https://github.com/P4R1H/roadmap-backend",
  },

  // Product Perspective
  product: {
    tldr: "Built an AI platform that generates personalized career roadmaps tailored to individual profiles. Uses Gemini API to create structured learning paths based on your skills, goals, and experience.",
    points: [
      {
        highlight: "AI-Powered Roadmaps:",
        text: "Leverages Google's Gemini API to generate customized learning paths based on user profiles, career goals, and current skill levels."
      },
      {
        highlight: "95% User Satisfaction:",
        text: "Achieved high satisfaction in testing through personalized, actionable recommendations."
      },
      {
        highlight: "Fast Response Times:",
        text: "Implemented JSON tokenization algorithm reducing wait time by 70% compared to standard streaming approaches."
      },
      {
        highlight: "Scalable Backend:",
        text: "Designed to support 1,000+ concurrent users with JWT authentication and rate limiting."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "FastAPI backend with MongoDB for data persistence, integrating Google AI Studio's Gemini API for intelligent roadmap generation.",
    stack: ["py", "fastapi", "mongodb", "gemini", "jwt"],
  },

  isExpandable: true,
  isFeatured: true,
};

// For the All Projects list
export const skillJourneyListItem: ProjectListItem = {
  id: "skilljourney",
  name: "SkillJourney",
  category: "ML",
  year: "2024",
  description: "AI career roadmap generator using Gemini API, 95% satisfaction",
  highlight: "95% satisfaction",
  stack: ["py", "fastapi", "mongodb", "gemini"],
  isExpandable: true,
  projectData: skillJourneyProject,
};

// Tesseract cell for the grid
export const skillJourneyCell: TesseractCellData = {
  id: "skilljourney",
  title: "SkillJourney",
  subtitle: "AI Roadmaps",
  content: <div className="text-zinc-500 text-xs">AI Career Roadmaps</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={skillJourneyProject} onClose={onClose} />
  ),
};
