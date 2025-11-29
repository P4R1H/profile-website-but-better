import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full StockPiece project data
export const stockPieceProject: ProjectData = {
  id: "stockpiece",
  name: "StockPiece",
  tagline: "A mock financial market where One Piece fans trade character stocks like real investments. Scaled to 140,000+ users across 100+ countries.",
  category: "Web",
  year: "2024",
  icon: "/projects/berry.webp", // Add project icon
  links: {
    live: "https://stockpiece.app",
    github: "https://github.com/P4R1H/stockpiece",
  },

  // Product Perspective
  product: {
    tldr: "Built a fantasy stock market where One Piece fans trade character stocks like real investments. Market windows sync with TCB chapter releases to create fair, event-driven trading.",
    points: [
      {
        highlight: "140,000+ users",
        text: "from 100+ countries trading character stocks based on their agendas and manga events."
      },
      {
        highlight: "8M+ monthly API requests",
        text: "at peak traffic, maintaining 99.9% uptime on distributed Hetzner infrastructure."
      },
      {
        highlight: "Market Mechanics:",
        text: "Trading windows open during official chapter releases and close before leaks to prevent insider trading. Prices driven by volume, popularity, and market momentum."
      },
      {
        highlight: "Fair Competition:",
        text: "Everyone starts with 10,000 Berries. Climb the leaderboard by maximizing net worth through strategic trading."
      },
      {
        highlight: "Community:",
        text: "Active Discord with thousands of members sharing strategies, analyzing trends, and pushing their One Piece agendas."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Full-stack TypeScript application with a custom engagement algorithm updating 100+ stock prices weekly using volume impact and logarithmic dampening to prevent market manipulation.",
    stack: ["ts", "react", "vite", "nodejs", "express", "mongodb", "redis", "docker", "cloudflare"],
  },

  // Design Perspective
  design: {
    summary: "Playful yet functional design optimized for mobile-first usage. Users should understand how to trade within 30 seconds of landing.",
    screenshot: "projects/stockpiece.jpg",
    decisions: [
      { key: "Style", value: "Playful One Piece theming with clean, data-forward interface" },
      { key: "UX Priority", value: "Mobile-first responsive design, high-glanceability" },
      { key: "Color System", value: "Green/Red for gains/losses, Berries currency theming" },
      { key: "Charts", value: "Interactive price histories to analyze character popularity trends" },
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
  description: "One Piece character stock market, 140k+ users, 8M+ monthly requests",
  highlight: "140k+ users",
  stack: ["ts", "react", "mongodb", "redis"],
  isExpandable: true,
  projectData: stockPieceProject,
};

// Tesseract cell for the grid
export const stockPieceCell: TesseractCellData = {
  id: "stockpiece",
  title: "StockPiece",
  subtitle: "140k+ Users",
  content: <div className="text-zinc-500 text-xs">Manga Stock Market</div>,
  rowSpan: 2,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={stockPieceProject} onClose={onClose} />
  ),
};
