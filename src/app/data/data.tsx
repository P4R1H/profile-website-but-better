import { TesseractCellData } from '@/types';
import { TerminalUI, SnakeGame, ImageGallery } from '../components';

export const experienceItems: TesseractCellData[] = [
  { 
    id: "cred", 
    title: "CRED", 
    subtitle: "Backend Intern", 
    content: <div className="text-zinc-500 text-xs">Wealth Management</div>,
    rowSpan: 2 
  },
  { 
    id: "hpe", 
    title: "HPE", 
    subtitle: "Project Intern", 
    content: <div className="text-zinc-500 text-xs">Infrastructure</div> 
  },
  { 
    id: "ecom", 
    title: "Ecom Express", 
    subtitle: "ML Intern", 
    content: <div className="text-zinc-500 text-xs">Computer Vision</div> 
  },
  { 
    id: "conscent", 
    title: "Conscent", 
    subtitle: "Data Science", 
    content: <div className="text-zinc-500 text-xs">Big Data</div> 
  },
  { 
    id: "persona", 
    title: "Persona", 
    subtitle: "Team Lead", 
    content: <div className="text-zinc-500 text-xs">Full Stack</div> 
  },
];

// --- Project Items ---
export const projectItems: TesseractCellData[] = [
  { 
    id: "stockpiece", 
    title: "StockPiece", 
    subtitle: "Fintech Game"
  },
  { 
    id: "skilljourney", 
    title: "Skill Journey", 
    subtitle: "AI EdTech" 
  },
  { 
    id: "bots", 
    title: "Community Bots", 
    subtitle: "Automation" 
  },
  {
    id: "chat-terminal",
    title: "Chat Terminal",
    subtitle: "Interactive CLI",
    renderExpanded: ({ onClose, cell }) => <TerminalUI onClose={onClose} cell={cell} />,
  },
  {
    id: "snake",
    title: "Snake Game",
    subtitle: "Play Now!",
    renderExpanded: ({ onClose }) => <SnakeGame onClose={onClose} />,
  },
];

// --- Root Items ---
export const rootItems: TesseractCellData[] = [
  { 
    id: "profile", 
    title: "Parth Gupta", 
    subtitle: "Full Stack Developer", 
    content: <div className="text-sm text-zinc-400 mt-2">Building things that matter.</div>,
    rowSpan: 2 
  },
  { 
    id: "exp", 
    title: "Experience", 
    subtitle: "My Journey", 
    children: experienceItems 
  },
  { 
    id: "projects", 
    title: "Projects", 
    subtitle: "What I've Built", 
    children: projectItems 
  },
  { 
    id: "stack", 
    title: "Stack", 
    subtitle: "My Arsenal" 
  },
  { 
    id: "connect", 
    title: "Connect", 
    subtitle: "Reach Out" 
  },
  { 
    id: "blog", 
    title: "Blog", 
    subtitle: "Thoughts" 
  },
  {
    id: "photos",
    title: "Photos",
    subtitle: "Gallery",
    renderExpanded: ({ onClose }) => <ImageGallery onClose={onClose} />,
  },
  { 
    id: "extra", 
    title: "Extra", 
    subtitle: "More Stuff",
    isLeaf: true,
    content: <div className="text-zinc-600 text-xs mt-2">This is a leaf node</div>
  },
  { 
    id: "extra2", 
    title: "Misc", 
    subtitle: "Details" 
  },
];