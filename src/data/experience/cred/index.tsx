import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const credData = {
  company: "CRED",
  role: "Backend Intern (Wealth)",
  location: "Remote",
  period: "Oct 2025 – Jan 2026",
  description: "Building wealth management infrastructure from the ground up.",
  highlights: [
    "Zero-to-One Architecture: Building CRED's wealth management platform, designing secure, resilient, and scalable microservices.",
    "High-Volume Systems: Developing RESTful APIs capable of processing millions of concurrent transactions with sub-second latency.",
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
