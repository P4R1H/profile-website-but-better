import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const credData = {
  company: "CRED",
  role: "Backend Intern (Wealth)",
  location: "Remote",
  period: "Oct 2025 – Jan 2026",
  description: "Building CRED's wealth management platform from scratch. Working on secure, resilient microservices at scale.",
  highlights: [
    "Architecture: Designing and implementing CRED's wealth management platform backend architecture from scratch.",
    "High-Performance APIs: Building RESTful APIs handling millions of concurrent transactions with sub-second latency.",
    "Production Systems: Working with Go, Java, and AWS to develop production-grade financial infrastructure.",
  ],
  stack: ["Go", "Java", "JavaScript", "AWS"],
};

export const credCell: TesseractCellData = {
  id: "cred",
  title: "CRED",
  subtitle: "Backend Intern",
  content: <div className="text-zinc-500 text-xs">Wealth Management</div>,
  rowSpan: 2,
  renderExpanded: ({ onClose }) => <ExperienceExpanded data={credData} onClose={onClose} />,
};
