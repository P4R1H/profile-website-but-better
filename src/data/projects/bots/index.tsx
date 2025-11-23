import { TesseractCellData } from "@/types/types";
import { ProjectDetail } from "@/components/cards/projects/ProjectDetail";

export const botsData = {
  name: "Community Bots",
  type: "Automation",
  description: "Automated moderation tools for Reddit and Discord communities serving over 10 million members.",
  highlights: [
    "Moderated communities with over 10 million total members.",
    "Tools are still in active use today.",
    "Implemented complex moderation rules and automated actions."
  ],
  stack: ["Python", "Discord.py", "Reddit API"], // Placeholder stack
};

export const botsCell: TesseractCellData = {
  id: "bots",
  title: "Community Bots",
  subtitle: "10M+ Members",
  content: <div className="text-zinc-500 text-xs">Automation</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => <ProjectDetail data={botsData} onClose={onClose} />,
};
