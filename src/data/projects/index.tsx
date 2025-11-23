import { TesseractCellData } from '@/types/types';
import { stockPieceCell } from './stockpiece';
import { botsCell } from './bots';
import { personaToolsCell } from './persona';
import { ProjectList } from '@/components/cards/projects/ProjectList';
import { ProjectDetail } from '@/components/cards/projects/ProjectDetail';
import React from 'react';

// Placeholder for a 4th curated project
const ecommerceData = {
  name: "E-commerce Platform",
  type: "Web Development",
  description: "A scalable, headless e-commerce platform built with Next.js and Shopify.",
  highlights: [
    "Headless architecture for maximum performance.",
    "Integrated with Shopify Storefront API.",
    "Custom checkout experience."
  ],
  stack: ["Next.js", "Shopify", "Tailwind CSS"],
};

const ecommerceCell: TesseractCellData = {
  id: "ecommerce",
  title: "E-commerce Platform",
  subtitle: "Headless Shopify",
  content: <div className="text-zinc-500 text-xs">Web Development</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => <ProjectDetail data={ecommerceData} onClose={onClose} />,
};

// View All Cell
const viewAllCell: TesseractCellData = {
  id: "view-all-projects",
  title: "VIEW ALL",
  subtitle: "Archive",
  content: <div className="text-zinc-500 text-xs">Full List</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => <ProjectList onClose={onClose} />,
};

export const projectItems: TesseractCellData[] = [
  stockPieceCell,
  botsCell,
  personaToolsCell,
  ecommerceCell,
  viewAllCell,
];

export const projectsData: TesseractCellData = {
  id: "projects",
  title: "PROJECTS",
  subtitle: "Millions in metrics.",
  rowSpan: 2,
  children: projectItems
};
