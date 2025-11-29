import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full Persona Tools project data
export const personaProject: ProjectData = {
  id: "persona-tools",
  name: "Persona Essential",
  tagline: "Full-stack platform centralizing $200,000+ in lifetime payments and delivering 400M+ impressions.",
  category: "Web",
  year: "2023",

  // Product Perspective
  product: {
    tldr: "Led a team of 90+ creators, building tools to manage content strategy for clients like OperaGX, Polymarket, and Dreamworks.",
    points: [
      {
        highlight: "Team Leadership:",
        text: "Managed 90+ creators across multiple social platforms."
      },
      {
        highlight: "$200k+ processed",
        text: "through the centralized payment and reporting platform."
      },
      {
        highlight: "400M+ impressions",
        text: "delivered for major brand clients."
      },
      {
        highlight: "Operational efficiency:",
        text: "Reduced manual overhead by 60% through automation."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Full-stack Next.js application with custom dashboards, payment tracking, and analytics integrations.",
    stack: ["nextjs", "ts", "py", "mongodb"],
  },

  isExpandable: true,
  isFeatured: true,
};

// For the All Projects list
export const personaListItem: ProjectListItem = {
  id: "persona-tools",
  name: "Persona Essential",
  category: "Web",
  year: "2023",
  description: "Creator management platform, $200k+ processed",
  highlight: "$200k+ processed",
  stack: ["nextjs", "ts", "py", "mongodb"],
  isExpandable: true,
  projectData: personaProject,
};

// Tesseract cell for the grid
export const personaToolsCell: TesseractCellData = {
  id: "persona-tools",
  title: "Persona Tools",
  subtitle: "$200k+ Processed",
  content: <div className="text-zinc-500 text-xs">Internal Platform</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={personaProject} onClose={onClose} />
  ),
};
