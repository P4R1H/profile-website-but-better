import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full Community Bots project data
export const botsProject: ProjectData = {
  id: "bots",
  name: "Community Bots",
  tagline: "Automated moderation tools for Reddit and Discord communities serving over 10 million members.",
  category: "Infrastructure",
  year: "2020",
  links: {
    github: "https://github.com/P4R1H",
  },

  // Product Perspective
  product: {
    tldr: "Built a suite of moderation bots that handle content filtering, user management, and community engagement at scale.",
    points: [
      {
        highlight: "10M+ members",
        text: "moderated across Reddit and Discord communities."
      },
      {
        highlight: "Still in active use",
        text: "— the bots continue running years after initial deployment."
      },
      {
        highlight: "QualityVote:",
        text: "A democratic content moderation system reducing moderator workload."
      },
      {
        highlight: "SSH Bypass:",
        text: "Engineered a solution to circumvent ISP port forwarding restrictions using Discord as a secure tunnel."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Python-based bots leveraging async programming for high-throughput message processing and real-time moderation.",
    stack: ["py", "redis", "linux", "docker", "bash"],
  },

  // Architecture Perspective (no design for this project)
  architecture: {
    summary: "Self-hosted on personal infrastructure with emphasis on reliability and zero-downtime updates.",
    hosting: [
      {
        platform: "Raspberry Pi",
        icon: "raspberrypi",
        reason: "Low-power, always-on home server"
      },
      {
        platform: "Linux",
        icon: "linux",
        reason: "Systemd services for auto-restart and logging"
      },
    ],
  },

  isExpandable: true,
  isFeatured: true,
};

// For the All Projects list
export const botsListItem: ProjectListItem = {
  id: "bots",
  name: "Community Bots",
  category: "Infrastructure",
  year: "2020",
  description: "Moderation tools for 10M+ member communities",
  highlight: "10M+ members",
  stack: ["py", "redis", "linux", "docker"],
  isExpandable: true,
  projectData: botsProject,
};

// Tesseract cell for the grid
export const botsCell: TesseractCellData = {
  id: "bots",
  title: "Community Bots",
  subtitle: "10M+ Members",
  content: <div className="text-zinc-500 text-xs">Infrastructure</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={botsProject} onClose={onClose} />
  ),
};
