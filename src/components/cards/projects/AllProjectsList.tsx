"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ProjectListItem, ProjectCategory } from "@/types/projects";
import { ProjectExpanded } from "./ProjectExpanded";

interface AllProjectsListProps {
  projects: ProjectListItem[];
  onClose: () => void;
}

const FILTERS: { label: string; value: ProjectCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Web", value: "Web" },
  { label: "ML", value: "ML" },
  { label: "Infra", value: "Infrastructure" },
  { label: "Mobile", value: "Mobile" },
  { label: "Other", value: "Other" },
];

const CATEGORY_SHORT: Record<ProjectCategory, string> = {
  Web: "Web",
  ML: "ML",
  Infrastructure: "Infra",
  Mobile: "Mobile",
  Other: "Other",
};

// Animation config matching Tesseract
const EXPAND_DURATION = 0.6;
const COLLAPSE_DURATION = 0.5;
const EASE = [0.22, 1, 0.36, 1] as const;

export const AllProjectsList = ({ projects, onClose }: AllProjectsListProps) => {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectListItem | null>(null);
  const [isLocked, setIsLocked] = useState(false); // True when a project is fully expanded

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter(p => p.category === filter);

  const filterLabel = filter === "All" ? "" : FILTERS.find(f => f.value === filter)?.label || "";

  const handleClick = (project: ProjectListItem, isMobile: boolean) => {
    if (isLocked) return;

    // Projects with full page view -> go directly to full page
    if (project.isExpandable && project.projectData) {
      setIsLocked(true);
      setSelectedProject(project);
      return;
    }

    // Projects without full page view -> toggle inline expansion
    setExpandedId(expandedId === project.id ? null : project.id);
  };

  const handleClose = () => {
    setIsLocked(false);
    setSelectedProject(null);
  };

  const isActiveProject = (project: ProjectListItem) => 
    isLocked && selectedProject?.id === project.id;

  return (
    <LayoutGroup>
      <div className="w-full h-full bg-black relative overflow-hidden">
        {/* List View - animates away when a project is selected */}
        <motion.div
          className="absolute inset-0 flex flex-col overflow-hidden"
          animate={{
            opacity: isLocked ? 0 : 1,
          }}
          transition={{
            opacity: { duration: 0.3, delay: isLocked ? 0 : 0.2 }
          }}
          style={{ pointerEvents: isLocked ? "none" : "auto" }}
        >
          {/* Header */}
          <div className="shrink-0 px-4 md:px-8 pt-6 pb-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Count */}
              <p className="font-mono text-sm tracking-wide">
                <span className="text-zinc-100">{filteredProjects.length}</span>
                <span className="text-zinc-600 mx-2">—</span>
                <span className="text-zinc-400 uppercase text-xs">{filterLabel || "All"} Projects</span>
              </p>

              {/* Right: Filter pills */}
              <div className="flex flex-wrap justify-end gap-1.5">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-2 py-0.5 text-[10px] md:text-[11px] font-mono uppercase tracking-wider border transition-all ${
                      filter === f.value
                        ? "bg-zinc-100 text-black border-zinc-100"
                        : "text-zinc-600 border-zinc-800 hover:border-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="shrink-0 mx-4 md:mx-8 border-t border-zinc-800" />

          {/* Project List */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 md:px-8 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => {
                const isExpanded = expandedId === project.id;
                const stack = project.stack || project.projectData?.engineering?.stack || [];
                
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.015 }}
                    className={`group border-b border-zinc-900/50 ${
                      !project.isExpandable ? "opacity-50" : ""
                    }`}
                  >
                    {/* Desktop Row */}
                    <div
                      className="hidden md:flex items-center py-2.5 cursor-pointer hover:bg-zinc-950/30 -mx-2 px-2 transition-colors"
                      onClick={() => handleClick(project, false)}
                    >
                      <h3 className={`shrink-0 w-36 font-medium truncate ${
                        project.isExpandable ? "text-zinc-200 group-hover:text-zinc-100" : "text-zinc-500"
                      }`}>
                        {project.name}
                      </h3>
                      <span className="flex-1 text-zinc-500 text-sm truncate px-4">
                        {project.description}
                      </span>
                      <span className="hidden lg:block w-20 text-zinc-600 font-mono text-[10px] uppercase truncate text-right">
                        {stack.slice(0, 2).join(" · ")}
                      </span>
                      <span className="w-20 text-zinc-600 font-mono text-xs text-right">
                        {CATEGORY_SHORT[project.category]} · {project.year}
                      </span>
                      <div className={`w-6 flex justify-end ml-2 ${
                        project.isExpandable ? "text-zinc-500 group-hover:text-zinc-300" : `text-zinc-700 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`
                      }`}>
                        {project.isExpandable ? (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <path d="M5 3H13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div
                      className="flex md:hidden items-center py-3 cursor-pointer"
                      onClick={() => handleClick(project, true)}
                    >
                      <h3 className={`flex-1 font-medium truncate ${
                        project.isExpandable ? "text-zinc-200" : "text-zinc-500"
                      }`}>
                        {project.name}
                      </h3>
                      <span className="text-zinc-600 font-mono text-xs">
                        {CATEGORY_SHORT[project.category]} · {project.year}
                      </span>
                      <div className={`ml-3 ${
                        project.isExpandable ? "text-zinc-500" : `text-zinc-700 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`
                      }`}>
                        {project.isExpandable ? (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <path d="M5 3H13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Inline Expanded - for projects without full page */}
                    <AnimatePresence>
                      {isExpanded && !project.isExpandable && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 md:pb-4 md:pt-1 md:pl-36 md:pr-8 flex flex-col md:flex-row md:items-center md:gap-4">
                            <p className="flex-1 text-sm text-zinc-500 leading-relaxed">
                              {project.description}
                            </p>
                            {stack.length > 0 && (
                              <p className="text-[10px] font-mono text-zinc-600 uppercase shrink-0 mt-1.5 md:mt-0">
                                {stack.join(" · ")}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-600 text-sm">No projects found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Expanded Project View - overlays and expands */}
        <AnimatePresence>
          {selectedProject?.projectData && (
            <motion.div
              key={selectedProject.id}
              className="absolute inset-0 bg-black z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: EXPAND_DURATION,
                ease: EASE,
              }}
            >
              {/* Content with delayed fade in */}
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.15, ease: "easeOut" },
                  scale: { duration: 0.5, delay: 0.1, ease: EASE },
                }}
              >
                <ProjectExpanded
                  project={selectedProject.projectData}
                  onClose={handleClose}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};
