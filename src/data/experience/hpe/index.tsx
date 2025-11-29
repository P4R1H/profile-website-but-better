import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const hpeData = {
  company: "Hewlett Packard Enterprise",
  role: "Project Intern (Backend Infrastructure)",
  location: "Remote",
  period: "Feb 2025 – July 2025",
  description: "Built middleware between Redfish Event Service and RabbitMQ to deduplicate server monitoring events.",
  highlights: [
    "Middleware Design: Developed middleware with configurable cache-and-expiry mechanism deduplicating events between Redfish Event Service and RabbitMQ.",
    "Performance: Processing 10,000+ daily alerts with 2ms median processing time, achieving 70% reduction in redundant notifications in worst-case scenarios.",
    "Testing Infrastructure: Built web-based benchmarking suite testing 15+ event patterns across multiple operational modes with real-time metrics.",
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
