import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const hpeData = {
  company: "Hewlett Packard Enterprise",
  role: "Project Intern (Backend Infrastructure)",
  location: "Remote",
  period: "Feb 2025 – July 2025",
  description: "Optimizing server management and event processing.",
  highlights: [
    "Event Deduplication: Designed a Redfish event engine processing 10,000+ daily alerts, reducing redundant notifications by 70%.",
    "Performance: Achieved a 2ms median processing time via a configurable cache-and-expiry mechanism.",
    "Benchmarking: Built a suite to test 15+ event patterns, ensuring system stability across operational modes.",
  ],
  stack: ["Python", "NextJS", "RabbitMQ", "RedfishES"],
};

export const hpeCell: TesseractCellData = {
  id: "hpe",
  title: "HPE",
  subtitle: "Project Intern",
  content: <div className="text-zinc-500 text-xs">Infrastructure</div>,
  renderExpanded: ({ onClose }) => <ExperienceExpanded data={hpeData} onClose={onClose} />,
};
