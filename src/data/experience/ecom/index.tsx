import { TesseractCellData } from "@/types/types";
import { ExperienceExpanded } from "@/components/cards/experience/ExperienceExpanded";

export const ecomData = {
  company: "Ecom Express",
  role: "Applied Machine Learning Intern",
  location: "Gurgaon, India",
  period: "May 2024 – July 2024",
  description: "Built an end-to-end helmet detection system for 30,000+ field executives. Got full ownership from data collection to deployment.",
  highlights: [
    "Model Development: Built CNN-based helmet detection model achieving 99.7% validation accuracy using ResNet50 transfer learning for 30,000+ field executives.",
    "Deployment: Deployed FastAPI endpoints processing 5,000+ daily validations with 10ms response time.",
    "Identity Verification: Created facial embedding system using transfer learning for identity verification across 1,000+ delivery hubs.",
  ],
  stack: ["Python", "TensorFlow", "Keras", "FastAPI", "MongoDB"],
};

export const ecomCell: TesseractCellData = {
  id: "ecom",
  title: "Ecom Express",
  subtitle: "ML Intern",
  content: <div className="text-zinc-500 text-xs">Computer Vision</div>,
  renderExpanded: ({ onClose }) => <ExperienceExpanded data={ecomData} onClose={onClose} />,
};
