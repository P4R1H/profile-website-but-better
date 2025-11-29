import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full Persona Tools project data
export const personaProject: ProjectData = {
  id: "persona-tools",
  name: "Persona Essential",
  tagline: "Enterprise business platform managing 100+ creators and processing $200,000+ in payments for major brands.",
  category: "Web",
  year: "2023",
  icon: "/projects/persona.svg",
  links: {
    live: "https://personaessential.com",
  },

  // Product Perspective
  product: {
    tldr: "Built the complete technical infrastructure for a stealth advertising firm connecting brands with content creators. Platform handles everything from submission management to payment processing.",
    points: [
      {
        highlight: "Discord Bot:",
        text: "Handles 100+ daily creator submissions, automatically syncing with the admin platform for approval workflows and payment tracking."
      },
      {
        highlight: "Admin Platform:",
        text: "Full-stack dashboard for managing 100+ creators, tracking campaigns, processing payments, and analyzing performance metrics."
      },
      {
        highlight: "Landing Page:",
        text: "Conversion-optimized design achieving 12% CTR, securing clients including MrBeast, Netflix, OperaGX, Polymarket, Dreamworks, and Roku."
      },
      {
        highlight: "$200k+ processed,",
        text: "400M+ impressions delivered across campaigns for major brands."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Full-stack Next.js platform with Discord bot integration, payment processing, and real-time analytics.",
    stack: ["nextjs", "ts", "py", "mongodb", "discordjs"],
  },

  // Design Perspective
  design: {
    summary: "Clean, professional interface for both internal operations and client acquisition.",
    screenshot: "/projects/persona.png",
    decisions: [
      { key: "Landing Page", value: "Conversion-optimized design, 12% CTR" },
      { key: "Admin Dashboard", value: "Data-dense interface for managing 100+ creators" },
      { key: "Workflow", value: "Streamlined submission → approval → payment pipeline" },
      { key: "Branding", value: "Professional aesthetic to attract enterprise clients" },
    ],
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
  description: "Enterprise platform for 100+ creators, $200k+ processed, 400M+ impressions",
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
  content: <div className="text-zinc-500 text-xs">Creator Management</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={personaProject} onClose={onClose} />
  ),
};
