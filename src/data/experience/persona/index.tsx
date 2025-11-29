import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const personaData = {
  company: "Persona Essential",
  role: "Team Lead & Full-Stack Developer",
  location: "Remote",
  period: "Mar 2021 – Dec 2023",
  description: "Built the entire technical infrastructure for a stealth advertising firm while leading strategy and managing a team of 100+ creators.",
  highlights: [
    "Full-Stack Development: Developed complete technical infrastructure including website, admin platform, and Discord bot managing 100+ creators.",
    "Strategy & Leadership: Led social media advertising strategy for clients like OperaGX, Polymarket, and Dreamworks, organizing campaigns across multiple platforms.",
    "Scale: Platform processed $200,000+ in payments and delivered 400M+ impressions across campaigns.",
  ],
  stack: ["NextJS", "Python", "MongoDB", "Discord.js"],
};

export const personaCell: TesseractCellData = {
  id: "persona",
  title: "Persona",
  subtitle: "Team Lead",
  content: <div className="text-zinc-500 text-xs">Full Stack</div>,
  renderExpanded: ({ onClose }) => <ExperienceExpanded data={personaData} onClose={onClose} />,
};
