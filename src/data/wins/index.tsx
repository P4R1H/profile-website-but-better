import { TesseractCellData } from '@/types/types';
import { WinsExpanded } from '@/components/cards/wins/WinsExpanded';
import { WinsPreview } from '@/components/cards/wins/WinsPreview';
import React from 'react';

export type WinCategory = 'research' | 'hackathon' | 'cp' | 'opensource' | 'education' | 'community';

export interface WinItem {
  id: string;
  category: WinCategory;
  title: string;
  subtitle?: string;
  organization?: string;
  year: string;
  description?: string;
  stats?: { label: string; value: string }[];
  link?: string;
  // Layout hints
  colSpan?: number; // Default 1
  rowSpan?: number; // Default 1
  variant?: 'default' | 'hero' | 'stat' | 'list';
  featured?: boolean; // Star + glow for key achievements
}

export const winsList: WinItem[] = [
  // HERO: Research Paper
  {
    id: "research-1",
    category: "research",
    title: "Parallel Semantic Walk for Large Knowledge Graphs",
    organization: "IEEE MCSoC 2025",
    year: "2025",
    description: "Accepted at IEEE International Symposium on Many-Core SoC. Explores optimization of semantic walks on large-scale graphs.",
    stats: [
      { label: "Status", value: "Accepted" },
      { label: "Conf", value: "IEEE MCSoC" }
    ],
    colSpan: 2,
    rowSpan: 2,
    variant: 'hero',
    featured: true
  },

  // STATS: CP Ratings - Changed titles
  {
    id: "cp-1",
    category: "cp",
    title: "Codeforces",
    organization: "Specialist",
    year: "2024",
    stats: [{ label: "Rating", value: "1538" }],
    variant: 'stat'
  },
  {
    id: "cp-2",
    category: "cp",
    title: "CodeChef",
    organization: "3-Star",
    year: "2024",
    stats: [{ label: "Rating", value: "1735" }],
    variant: 'stat'
  },

  // LIST: Hackathons
  {
    id: "hack-1",
    category: "hackathon",
    title: "Google Hack4Change",
    organization: "Finalist (Top 0.002%)",
    year: "2024",
    description: "Global hackathon focused on social impact solutions.",
    colSpan: 2,
    variant: 'list',
    featured: true
  },
  {
    id: "hack-2",
    category: "hackathon",
    title: "Smart India Hackathon",
    organization: "Semi-Finalist",
    year: "2024",
    description: "World's biggest open innovation model.",
    colSpan: 2,
    variant: 'list'
  },

  // STAT: Amazon
  {
    id: "cp-3",
    category: "cp",
    title: "Amazon ML School",
    organization: "Selected",
    year: "2025",
    stats: [{ label: "Top", value: "5%" }],
    variant: 'stat'
  },

  // Open Source - Separated
  {
    id: "os-1",
    category: "opensource",
    title: "GSSOC'24",
    organization: "GirlScript Summer of Code",
    year: "2024",
    description: "Contributed to TensorFlow and React ecosystem projects.",
    colSpan: 1,
    variant: 'default'
  },
  {
    id: "os-2",
    category: "opensource",
    title: "Hacktoberfest",
    organization: "Open Source",
    year: "2024",
    description: "Multiple PRs merged across various repositories.",
    colSpan: 1,
    variant: 'default'
  },

  // DEFAULT: CTF
  {
    id: "comm-1",
    category: "community",
    title: "CTF Organizer",
    organization: "CyberSec Club",
    year: "2023",
    description: "Designed 20-level CTF with zero full clears.",
    colSpan: 1,
    variant: 'default'
  },

  // Recommendations
  {
    id: "rec-1",
    category: "community",
    title: "HPE Recommendation",
    organization: "Hewlett Packard Enterprise",
    year: "2025",
    description: "Recognized for exceptional performance in backend infrastructure development.",
    colSpan: 1,
    variant: 'default'
  },
  {
    id: "rec-2",
    category: "community",
    title: "OperaGX Recommendation",
    organization: "Opera Gaming",
    year: "2022",
    description: "Led content strategy delivering 400M+ impressions for OperaGX campaigns.",
    colSpan: 1,
    variant: 'default'
  },

  // WIDE: Education
  {
    id: "edu-1",
    category: "education",
    title: "B.Tech Computer Science",
    organization: "Shiv Nadar University",
    year: "2022-26",
    description: "CGPA: 8.78/10 | Dean's List x3",
    colSpan: 2,
    variant: 'list'
  },
  {
    id: "edu-2",
    category: "education",
    title: "DPS Ghaziabad",
    organization: "7-Year Scholar",
    year: "2008-22",
    description: "Silver Memento (Highest Academic Honor)",
    colSpan: 1,
    variant: 'default'
  }
];

export const winsData: TesseractCellData = {
  id: "wins",
  title: "WINS",
  subtitle: "Milestones & Recognition",
  content: <WinsPreview />,
  renderExpanded: ({ onClose }) => <WinsExpanded onClose={onClose} />,
};
