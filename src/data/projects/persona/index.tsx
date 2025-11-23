import { TesseractCellData } from "@/types/types";
import { ProjectDetail } from "@/components/cards/projects/ProjectDetail";

export const personaToolsData = {
  name: "Persona Essential Tools",
  type: "Internal Tools",
  description: "Streamlined operations for teams at Persona Essential.",
  highlights: [
    "Built internal tools to optimize team workflows.",
    "Significantly reduced manual operational overhead."
  ],
  stack: ["React", "TypeScript", "Internal APIs"], // Placeholder stack
};

export const personaToolsCell: TesseractCellData = {
  id: "persona-tools",
  title: "Persona Tools",
  subtitle: "Operations",
  content: <div className="text-zinc-500 text-xs">Internal Tools</div>,
  rowSpan: 1,
  renderExpanded: ({ onClose }) => <ProjectDetail data={personaToolsData} onClose={onClose} />,
};
