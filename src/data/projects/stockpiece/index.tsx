import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full StockPiece project data
export const stockPieceProject: ProjectData = {
  id: "stockpiece",
  name: "StockPiece",
  tagline: "A mock financial market for anime characters that scaled to 150,000+ users globally.",
  category: "Web",
  year: "2024",
  icon: "/projects/berry.webp", // Add project icon
  links: {
    live: "https://stockpiece.app",
    github: "https://github.com/P4R1H/stockpiece",
  },

  // Product Perspective
  product: {
    tldr: "Built a fantasy stock market where users trade anime characters like real stocks — complete with market dynamics, volatility, and community-driven price discovery.",
    points: [
      {
        highlight: "Problem:",
        text: "Anime fans had no engaging way to express opinions on character popularity beyond polls and tier lists."
      },
      {
        highlight: "Solution:",
        text: "A gamified market simulation where character prices reflect community sentiment in real-time."
      },
      {
        highlight: "140,000+ users",
        text: "from 100+ countries joined within the first 3 months of launch."
      },
      {
        highlight: "8M+ monthly API requests",
        text: "at peak traffic, requiring careful optimization and caching strategies."
      },
      {
        highlight: "Community-driven:",
        text: "Active Discord with 5,000+ members providing feedback and feature requests."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Full-stack TypeScript application with a custom market algorithm that updates 100+ stock prices weekly based on trading volume and logarithmic dampening.",
    stack: ["ts", "react", "nodejs", "express", "mongodb", "redis", "docker", "cloudflare"],
  },

  // Design Perspective
  design: {
    summary: "Designed for instant comprehension — users should understand the game within 30 seconds of landing.",
    screenshot: "projects/stockpiece.jpg", // Project screenshot
    decisions: [
      { key: "Style", value: "Clean, data-forward (inspired by Robinhood)" },
      { key: "Density", value: "High-glanceability, low cognitive load" },
      { key: "Color System", value: "Green/Red for gains/losses, muted backgrounds" },
      { key: "Mobile First", value: "70% of traffic came from mobile devices" },
    ],
  },

  // Architecture Perspective
  architecture: {
    summary: "Distributed infrastructure prioritizing reliability and cost-efficiency for a bootstrapped side project.",
    hosting: [
      {
        platform: "Hetzner Cloud",
        icon: "hetzner",
        reason: "Cost-effective EU servers with excellent performance"
      },
      {
        platform: "Cloudflare",
        icon: "cloudflare",
        reason: "CDN, DDoS protection, and edge caching"
      },
      {
        platform: "MongoDB Atlas",
        icon: "mongodb",
        reason: "Managed database with automatic scaling"
      },
    ],
  },

  isExpandable: true,
  isFeatured: true,
};

// For the All Projects list
export const stockPieceListItem: ProjectListItem = {
  id: "stockpiece",
  name: "StockPiece",
  category: "Web",
  year: "2024",
  description: "Mock financial market for anime characters, 150k+ users",
  highlight: "150k+ users",
  stack: ["ts", "react", "mongodb", "redis"],
  isExpandable: true,
  projectData: stockPieceProject,
};

// Tesseract cell for the grid
export const stockPieceCell: TesseractCellData = {
  id: "stockpiece",
  title: "StockPiece",
  subtitle: "150k+ Users",
  content: <div className="text-zinc-500 text-xs">Web Application</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={stockPieceProject} onClose={onClose} />
  ),
};
