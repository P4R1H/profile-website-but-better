import { TesseractCellData } from "@/types/types";
import { ProjectDetail } from "@/components/cards/projects/ProjectDetail";

export const stockPieceData = {
  name: "StockPiece",
  type: "Web Application",
  description: "A platform that brought joy to over 150,000+ users.",
  highlights: [
    "Scaled to support 150,000+ active users.",
    "Designed and implemented the core user experience."
  ],
  stack: ["React", "Node.js", "MongoDB"], // Placeholder stack
};

export const stockPieceCell: TesseractCellData = {
  id: "stockpiece",
  title: "StockPiece",
  subtitle: "150k+ Users",
  content: <div className="text-zinc-500 text-xs">Web App</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => <ProjectDetail data={stockPieceData} onClose={onClose} />,
};
