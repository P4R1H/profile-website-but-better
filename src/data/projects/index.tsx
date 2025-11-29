import { TesseractCellData } from '@/types/types';
import { ProjectListItem } from '@/types/projects';
import { stockPieceCell, stockPieceListItem } from './stockpiece';
import { moderationCell, moderationListItem } from './moderation';
import { personaToolsCell, personaListItem } from './persona';
import { skillJourneyCell, skillJourneyListItem } from './skilljourney';
import { AllProjectsList } from '@/components/cards/projects/AllProjectsList';
import React from 'react';

// All projects for the list view (expandable and non-expandable)
export const allProjectsList: ProjectListItem[] = [
  // Featured projects
  stockPieceListItem,
  personaListItem,
  moderationListItem,
  skillJourneyListItem,
  
  // Archive projects
  {
    id: "bread-ats",
    name: "Bread ATS",
    category: "ML",
    year: "2024",
    description: "ML-powered ATS with transparent scoring, candidate clustering, and skill gap analysis",
    highlight: "Academic Project",
    stack: ["py", "fastapi", "nextjs", "scikit"],
    isExpandable: false,
  },
  {
    id: "microservice-fault",
    name: "Microservice Fault Detection",
    category: "ML",
    year: "2024",
    description: "Multimodal RCA system, 66.7% AC@1, 272× faster than SOTA",
    highlight: "66.7% AC@1",
    stack: ["py", "pytorch", "pcmci"],
    links: {
      github: "https://github.com/P4R1H/microservice-fault-detection",
    },
    isExpandable: false,
  },
  {
    id: "sudoku-solver",
    name: "Sudoku Solver",
    category: "ML",
    year: "2024",
    description: "ML-based solver using floodfill algorithm, 40× faster than top GitHub repos",
    highlight: "40× faster",
    stack: ["py", "opencv", "ml"],
    isExpandable: false,
  },
  {
    id: "screeni",
    name: "Screeni",
    category: "Web",
    year: "2024",
    description: "Chrome extension for screenshot management",
    highlight: "Live",
    stack: ["ts", "chrome-api"],
    links: {
      live: "https://chromewebstore.google.com/detail/screeni/kgikmpnigjdiaoijbofcbahpjblcgeeh",
    },
    isExpandable: false,
  },
  {
    id: "aislopwiki",
    name: "AislopWiki",
    category: "Web",
    year: "2025",
    description: "WIP - Expected to surpass StockPiece in popularity",
    highlight: "WIP",
    stack: ["ts", "nextjs"],
    isExpandable: false,
  },
  {
    id: "resumelo",
    name: "Resumelo",
    category: "Web",
    year: "2024",
    description: "WIP - 1v1 resume arena for competitive resume improvement",
    highlight: "WIP",
    stack: ["ts", "nextjs"],
    isExpandable: false,
  },
  {
    id: "pattern-tracker",
    name: "Pattern Tracker",
    category: "Web",
    year: "2024",
    description: "Minimal web-based LeetCode pattern tracker for personal use",
    stack: ["html", "js", "css"],
    links: {
      live: "https://p4r1h.github.io/pattern-tracker/",
    },
    isExpandable: false,
  },
  {
    id: "profile-website-v1",
    name: "Profile Website v1",
    category: "Web",
    year: "2022",
    description: "made a dualphased profile website with a terminal view and a resume view",
    stack: ["html", "js", "css"],
    links: {
      github: "https://github.com/P4R1H/profile-website",
      live: "https://terminal.parthg.tech",
      resume: "https://resume.parthg.tech",
    },
    isExpandable: false,
  },
  {
    id: "this-website",
    name: "This Website",
    category: "Web",
    year: "2025",
    description: "Personal portfolio rebuilt with Next.js, TypeScript and a tesseract-inspired UI.",
    stack: ["ts", "nextjs"],
    links: {
      github: "https://github.com/P4R1H/profile-website-but-better",
      live: "https://parthg.tech",
    },
    isExpandable: false,
  },
  {
    id: "flourish",
    name: "Flourish",
    category: "Mobile",
    year: "2024",
    description: "WIP - Self-improvement app for personal habit tracking",
    highlight: "WIP",
    stack: ["ts", "react-native"],
    isExpandable: false,
  },
  {
    id: "gosocial",
    name: "GoSocial",
    category: "Web",
    year: "2024",
    description: "Social media app with Go backend and NextJS frontend (learning Go)",
    stack: ["go", "nextjs"],
    links: {
      github: "https://github.com/P4R1H/GoSocial",
    },
    isExpandable: false,
  },
  {
    id: "golang-todo",
    name: "Golang To-Do",
    category: "Web",
    year: "2024",
    description: "Simple RESTful to-do list API built while learning Go",
    stack: ["go"],
    links: {
      github: "https://github.com/P4R1H/golang-todo",
    },
    isExpandable: false,
  },
  {
    id: "fareplay",
    name: "FarePlay",
    category: "Web",
    year: "2024",
    description: "Uber clone built using software design principles",
    stack: ["ts", "nextjs"],
    isExpandable: false,
  },
  {
    id: "reddit-advertiser",
    name: "Reddit Advertiser",
    category: "Infrastructure",
    year: "2024",
    description: "Mass DM bot with rate limiting, database deduplication, and Discord logging",
    stack: ["py", "praw", "discordpy"],
    links: {
      github: "https://github.com/P4R1H/reddit-advertising-bot",
    },
    isExpandable: false,
  },
  {
    id: "cachesim",
    name: "CacheSim",
    category: "Systems",
    year: "2023",
    description: "Dynamic cache simulator in C, deep dive into pointers and memory",
    stack: ["c"],
    links: {
      github: "https://github.com/P4R1H/CacheSim",
    },
    isExpandable: false,
  },
  {
    id: "vigenere-breaking",
    name: "Vigenere Breaking",
    category: "Systems",
    year: "2024",
    description: "Breaks Vigenere cipher using Kasiski method and frequency analysis",
    stack: ["c"],
    links: {
      github: "https://github.com/P4R1H/VigenereBreaking",
    },
    isExpandable: false,
  },
  {
    id: "minimalator",
    name: "Minimalator",
    category: "Mobile",
    year: "2023",
    description: "Minimal Android calculator built in Kotlin",
    stack: ["kotlin"],
    links: {
      github: "https://github.com/P4R1H/Minimalator",
    },
    isExpandable: false,
  },
  {
    id: "port-forwarding-bypass",
    name: "Port Forwarding Bypass",
    category: "Infrastructure",
    year: "2024",
    description: "SSH through Discord to bypass ISP restrictions",
    stack: ["py", "discordpy"],
    links: {
      github: "https://github.com/P4R1H/port-forwarding-bypass",
    },
    isExpandable: false,
  },
  {
    id: "skincrawlerbot",
    name: "SkinCrawlerBot",
    category: "Infrastructure",
    year: "2020",
    description: "QualityVote bot for r/distressingmemes (400K members)",
    stack: ["py", "praw"],
    links: {
      github: "https://github.com/P4R1H/skincrawlerbot",
    },
    isExpandable: false,
  },
  {
    id: "video-queue-bot",
    name: "Video Queue Bot",
    category: "Infrastructure",
    year: "2020",
    description: "Video queue manager for r/shitposting moderation",
    stack: ["py", "praw"],
    links: {
      github: "https://github.com/P4R1H/video-queue-bot",
    },
    isExpandable: false,
  },
  {
    id: "omen-bot",
    name: "Omen Bot",
    category: "Infrastructure",
    year: "2021",
    description: "Community management bot for HP Omen Discord (15K members)",
    stack: ["py", "discordpy"],
    links: {
      github: "https://github.com/P4R1H/omen",
    },
    isExpandable: false,
  },
];

// View All Cell - opens the full project list
const viewAllCell: TesseractCellData = {
  id: "view-all-projects",
  title: "VIEW ALL",
  subtitle: "Archive",
  content: <div className="text-zinc-500 text-xs">Full List</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => (
    <AllProjectsList projects={allProjectsList} onClose={onClose} />
  ),
};

// Featured project cells for the grid
export const projectItems: TesseractCellData[] = [
  stockPieceCell,
  personaToolsCell,
  moderationCell,
  skillJourneyCell,
  viewAllCell,
];

// Main projects data for Tesseract
export const projectsData: TesseractCellData = {
  id: "projects",
  title: "PROJECTS",
  subtitle: "Millions in metrics.",
  rowSpan: 2,
  children: projectItems
};
