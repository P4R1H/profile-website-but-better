import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const conscentData = {
  company: "Conscent.ai",
  role: "Data Science Intern",
  location: "Delhi, India",
  period: "June 2023 – July 2023",
  description: "My first internship at a startup building AI-driven insights for website analytics. Got to experience the full product development lifecycle.",
  highlights: [
    "Data Analysis: Extracted and analyzed data from MongoDB and ClickHouse for C-suite presentations while participating in product development meetings.",
    "Automation: Worked with 200GB+ of data across distributed databases, creating Python scripts that reduced analysis-to-insight time by 60%.",
    "Learning: Gained exposure to full product lifecycle in a fast-paced startup environment, contributing to product decisions.",
  ],
  stack: ["Python", "MongoDB", "ClickHouse", "Matplotlib"],
};

export const conscentCell: TesseractCellData = {
  id: "conscent",
  title: "Conscent",
  subtitle: "Data Science",
  content: <div className="text-zinc-500 text-xs">Big Data</div>,
  renderExpanded: ({ onClose }) => <ExperienceExpanded data={conscentData} onClose={onClose} />,
};
