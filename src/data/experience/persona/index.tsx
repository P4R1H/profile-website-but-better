import { TesseractCellData } from "@/types/types";
import { CompanyDetail } from "@/components/cards/experience/CompanyDetail";

export const personaData = {
  company: "Persona Essential",
  role: "Team Lead & Full-Stack Developer",
  location: "Freelance",
  period: "Mar 2021 – Dec 2023",
  description: "Leading a team of creators and building full-stack infrastructure.",
  highlights: [
    "Leadership: Led a team of 90+ creators, managing content strategy for clients like OperaGX, Polymarket, and Dreamworks.",
    "Impact: Architected a full-stack platform centralizing $200,000+ in lifetime payments and delivering 400M+ impressions.",
  ],
  stack: ["NextJS", "Python", "MongoDB"],
};

export const personaCell: TesseractCellData = {
  id: "persona",
  title: "Persona",
  subtitle: "Team Lead",
  content: <div className="text-zinc-500 text-xs">Full Stack</div>,
  renderExpanded: ({ onClose }) => <CompanyDetail data={personaData} onClose={onClose} />,
};
