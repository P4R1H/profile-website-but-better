import { TesseractCellData } from '@/types/types';
import { ProjectListItem } from '@/types/projects';
import { stockPieceCell, stockPieceListItem } from './stockpiece';
import { botsCell, botsListItem } from './bots';
import { personaToolsCell, personaListItem } from './persona';
import { AllProjectsList } from '@/components/cards/projects/AllProjectsList';
import React from 'react';

// All projects for the list view (expandable and non-expandable)
export const allProjectsList: ProjectListItem[] = [
  stockPieceListItem,
  botsListItem,
  personaListItem,
  // Non-expandable projects (placeholders/archive)
  {
    id: "skill-journey",
    name: "Skill Journey",
    category: "ML",
    year: "2024",
    description: "AI-driven career roadmap generator using Gemini API",
    highlight: "Gemini API",
    stack: ["py", "react", "gcp"],
    isExpandable: false,
  },
  {
    id: "portfolio-v1",
    name: "Portfolio V1",
    category: "Web",
    year: "2022",
    description: "Previous portfolio website",
    stack: ["react", "ts"],
    isExpandable: false,
  },
  {
    id: "neural-net-vis",
    name: "Neural Net Visualizer",
    category: "ML",
    year: "2023",
    description: "Interactive neural network visualization tool",
    stack: ["py", "js"],
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
  botsCell,
  personaToolsCell,
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
