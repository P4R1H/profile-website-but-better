import { TesseractCellData } from "@/types/types";
import { CompanyDetail } from "@/components/cards/experience/CompanyDetail";

export const ecomData = {
  company: "Ecom Express",
  role: "Applied Machine Learning Intern",
  location: "Gurgaon, India",
  period: "May 2024 – July 2024",
  description: "Deploying Computer Vision at scale for logistics safety.",
  highlights: [
    "Safety Compliance: Implemented a CNN-based helmet detection model with 97% accuracy for 30,000+ field executives.",
    "Real-time Validation: Processed 5,000+ daily validations with a 10ms API response time.",
    "Identity Verification: Created a facial embedding system using transfer learning to verify personnel across 1,000+ delivery hubs.",
  ],
  stack: ["Python", "TensorFlow", "Keras", "FastAPI", "MongoDB"],
};

export const ecomCell: TesseractCellData = {
  id: "ecom",
  title: "Ecom Express",
  subtitle: "ML Intern",
  content: <div className="text-zinc-500 text-xs">Computer Vision</div>,
  renderExpanded: ({ onClose }) => <CompanyDetail data={ecomData} onClose={onClose} />,
};
