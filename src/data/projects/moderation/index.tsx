import { TesseractCellData } from "@/types/types";
import { ProjectData, ProjectListItem } from "@/types/projects";
import { ProjectExpanded } from "@/components/cards/projects/ProjectExpanded";

// Full Community Moderation Suite project data
export const moderationProject: ProjectData = {
  id: "moderation-suite",
  name: "Community Moderation Suite",
  tagline: "Automated moderation infrastructure serving 8.5M+ members across Reddit and Discord communities.",
  category: "Infrastructure",
  year: "2020",
  links: {
    github: "https://github.com/P4R1H",
  },

  // Product Perspective
  product: {
    tldr: "Built a suite of moderation bots for major Reddit communities and Discord servers. Moved moderation workflows from Reddit's native tools to Discord for 60% faster response times.",
    points: [
      {
        highlight: "8.5M+ members",
        text: "moderated across r/shitposting (1M), r/dankmemes (7M), r/distressingmemes (400K), and Discord communities (35K+)."
      },
      {
        highlight: "Full Moderation Suites:",
        text: "Built complete moderation infrastructure for r/shitposting and r/dankmemes, handling content filtering, repost detection, queue management, and automated actions."
      },
      {
        highlight: "QualityVote System:",
        text: "Democratic content moderation for r/distressingmemes. Users upvote top comment; if ratio reached, post auto-removes. Helped grow subreddit from 0 to 400K members."
      },
      {
        highlight: "Discord Integration:",
        text: "Moved moderation workflows to Discord where mods can discuss and moderate in the same place, increasing efficiency by 60%."
      },
      {
        highlight: "Still Running:",
        text: "Bots continue serving communities years after deployment with minimal maintenance."
      },
    ],
  },

  // Engineering Perspective
  engineering: {
    summary: "Python-based bots using PRAW (Reddit API) and Discord.py, with async programming for high-throughput message processing.",
    stack: ["py", "praw", "discordpy", "linux", "docker"],
  },

  // Architecture Perspective
  architecture: {
    summary: "Self-hosted on personal infrastructure with emphasis on reliability and zero-downtime updates.",
    hosting: [
      {
        platform: "Raspberry Pi",
        icon: "raspberrypi",
        reason: "Low-power, always-on home server for 24/7 uptime"
      },
      {
        platform: "Linux",
        icon: "linux",
        reason: "Systemd services for auto-restart and logging"
      },
      {
        platform: "Docker",
        icon: "docker",
        reason: "Containerized deployment for easy updates"
      },
    ],
  },

  isExpandable: true,
  isFeatured: true,
};

// For the All Projects list
export const moderationListItem: ProjectListItem = {
  id: "moderation-suite",
  name: "Community Moderation Suite",
  category: "Infrastructure",
  year: "2020",
  description: "Automated moderation for 8.5M+ members across Reddit/Discord",
  highlight: "8.5M+ members",
  stack: ["py", "praw", "discordpy", "linux"],
  isExpandable: true,
  projectData: moderationProject,
};

// Tesseract cell for the grid
export const moderationCell: TesseractCellData = {
  id: "moderation-suite",
  title: "Moderation Suite",
  subtitle: "8.5M+ Members",
  content: <div className="text-zinc-500 text-xs">Community Moderation</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <ProjectExpanded project={moderationProject} onClose={onClose} />
  ),
};
