import { TesseractCellData } from '@/types/types';
import React from 'react';

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


export const experienceData: TesseractCellData = {
  id: "experience",
  title: "EXPERIENCE",
  subtitle: "Startups, Unicorns, MNCs",
  rowSpan: 2,
  children: experienceItems
};
