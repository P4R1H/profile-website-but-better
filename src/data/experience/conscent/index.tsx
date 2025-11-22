import { TesseractCellData } from "@/types/types";
import { CompanyDetail } from "@/components/cards/experience/CompanyDetail";

export const conscentData = {
  company: "Conscent.ai",
  role: "Data Science Intern",
  location: "Delhi, India",
  period: "June 2023 – July 2023",
  description: "Big Data Analysis for C-suite decision-making.",
  highlights: [
    "Big Data Analysis: Analyzed 200GB+ of data across MongoDB and ClickHouse to drive C-suite decision-making.",
    "Automation: Created Python scripts that reduced analysis-to-insight turnaround time by 60%.",
  ],
  stack: ["Python", "MongoDB", "ClickHouse"],
};

export const conscentCell: TesseractCellData = {
  id: "conscent",
  title: "Conscent",
  subtitle: "Data Science",
  content: <div className="text-zinc-500 text-xs">Big Data</div>,
  renderExpanded: ({ onClose }) => <CompanyDetail data={conscentData} onClose={onClose} />,
};
