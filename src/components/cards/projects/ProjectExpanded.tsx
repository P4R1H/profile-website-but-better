"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectData, PerspectiveType, PerspectiveConfig } from "@/types/projects";
import {
  ProductPerspective,
  EngineeringPerspective,
  DesignPerspective,
  ArchitecturePerspective,
} from "./perspectives";

interface ProjectExpandedProps {
  project: ProjectData;
  onClose: () => void;
}

// ============================================================================
// PROJECT HERO
// ============================================================================

const ProjectHero = ({ project }: { project: ProjectData }) => {
  return (
    <div className="relative w-full">
      <div className="px-4 md:px-12 pt-6 md:pt-8 pb-4 md:pb-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Category & Year + Icon on mobile */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  {project.category}
                </span>
                <span className="w-6 h-px bg-zinc-700" />
                <span className="text-zinc-600 font-mono text-xs">
                  {project.year}
                </span>
              </div>
              
              {/* Icon on mobile - inline with category */}
              {project.icon && (
                <div className="flex md:hidden shrink-0 w-10 h-10 bg-zinc-950 border border-zinc-800 items-center justify-center mt-1">
                  <img
                    src={project.icon}
                    alt={`${project.name} icon`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Project Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tighter mb-3">
              {project.name}
            </h1>

            {/* Tagline */}
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-4">
              {project.tagline}
            </p>

            {/* Links */}
            {project.links && (
              <div className="flex items-center gap-3">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-colors text-sm font-medium"
                  >
                    Live
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-colors text-sm font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Icon */}
          {project.icon && (
            <div className="hidden md:flex shrink-0 w-14 h-14 bg-zinc-950 border border-zinc-800 items-center justify-center">
              <img
                src={project.icon}
                alt={`${project.name} icon`}
                className="w-9 h-9 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PERSPECTIVE ACCORDION
// ============================================================================

const PERSPECTIVE_LABELS: Record<PerspectiveType, string> = {
  product: "Product",
  engineering: "Engineering", 
  design: "Design",
  architecture: "Architecture",
};

const PerspectiveAccordion = ({ 
  project, 
  isMobile,
  scrollContainerRef 
}: { 
  project: ProjectData; 
  isMobile: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  // Determine which perspectives are available
  const allPerspectives: PerspectiveConfig[] = [
    { id: "product" as PerspectiveType, label: PERSPECTIVE_LABELS.product, available: !!project.product },
    { id: "engineering" as PerspectiveType, label: PERSPECTIVE_LABELS.engineering, available: !!project.engineering },
    { id: "design" as PerspectiveType, label: PERSPECTIVE_LABELS.design, available: !!project.design },
    { id: "architecture" as PerspectiveType, label: PERSPECTIVE_LABELS.architecture, available: !!project.architecture },
  ];
  
  const perspectives = allPerspectives.filter(p => p.available);

  // On desktop, open Product by default. On mobile, keep all collapsed
  const [activeId, setActiveId] = useState<PerspectiveType | null>(() => {
    if (isMobile) return null;
    // Default to Product perspective if available, otherwise first available
    return perspectives.find(p => p.id === "product")?.id || perspectives[0]?.id || null;
  });

  // Update activeId when switching between mobile and desktop
  useEffect(() => {
    if (!isMobile && activeId === null) {
      // Switching to desktop - open Product or first available
      const defaultId = perspectives.find(p => p.id === "product")?.id || perspectives[0]?.id || null;
      setActiveId(defaultId);
    } else if (isMobile && activeId !== null) {
      // Switching to mobile - collapse all
      setActiveId(null);
    }
  }, [isMobile, perspectives, activeId]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const accordionRefs = useRef<Map<PerspectiveType, HTMLDivElement>>(new Map());
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowBottomBlur(scrollHeight - scrollTop - clientHeight > 10);
  };

  useEffect(() => {
    handleScroll();
  }, [activeId]);

  // Auto-scroll to opened accordion on mobile
  const handleAccordionToggle = (perspectiveId: PerspectiveType, isCurrentlyActive: boolean) => {
    const newActiveId = isCurrentlyActive ? null : perspectiveId;
    setActiveId(newActiveId);
    
    // Auto-scroll to the accordion header on mobile when opening
    if (isMobile && newActiveId && scrollContainerRef?.current) {
      const accordionEl = accordionRefs.current.get(perspectiveId);
      if (accordionEl) {
        // Wait for the accordion animation to start
        setTimeout(() => {
          const containerRect = scrollContainerRef.current!.getBoundingClientRect();
          const accordionRect = accordionEl.getBoundingClientRect();
          const scrollTop = scrollContainerRef.current!.scrollTop;
          const targetScroll = scrollTop + accordionRect.top - containerRect.top - 12; // 12px offset from top
          
          scrollContainerRef.current!.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }, 50);
      }
    }
  };

  const renderPerspectiveContent = (id: PerspectiveType) => {
    switch (id) {
      case "product":
        return project.product ? <ProductPerspective data={project.product} /> : null;
      case "engineering":
        return project.engineering ? <EngineeringPerspective data={project.engineering} /> : null;
      case "design":
        return project.design ? <DesignPerspective data={project.design} /> : null;
      case "architecture":
        return project.architecture ? <ArchitecturePerspective data={project.architecture} /> : null;
      default:
        return null;
    }
  };

  if (perspectives.length === 0) {
    return null;
  }

  // Desktop: Horizontal layout with tabs
  if (!isMobile) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Tab Headers - Fixed */}
        <div className="shrink-0 flex border-b border-zinc-800">
          {perspectives.map((perspective) => (
            <button
              key={perspective.id}
              onClick={() => setActiveId(perspective.id)}
              className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                activeId === perspective.id
                  ? "text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {perspective.label}
              {activeId === perspective.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-zinc-400"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 min-h-0 relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto scrollbar-hide pt-4 pb-8"
          >
            <AnimatePresence mode="wait">
              {activeId && (
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  {renderPerspectiveContent(activeId)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Blur */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black via-black/80 to-transparent pointer-events-none transition-opacity duration-300 ${
              showBottomBlur ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    );
  }

  // Mobile: Vertical Accordion - no scroll container, parent handles scrolling
  return (
    <div className="w-full space-y-2 pb-8">
      {perspectives.map((perspective) => {
        const isActive = activeId === perspective.id;
        
        return (
          <div
            key={perspective.id}
            ref={(el) => {
              if (el) accordionRefs.current.set(perspective.id, el);
            }}
            className="border border-zinc-800 bg-zinc-950/50 overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => handleAccordionToggle(perspective.id, isActive)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                isActive ? "bg-zinc-900/50" : "hover:bg-zinc-900/30"
              }`}
            >
              <span className={`text-sm font-medium transition-colors ${
                isActive ? "text-zinc-100" : "text-zinc-400"
              }`}>
                {perspective.label}
              </span>
              
              {/* Chevron */}
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-zinc-500"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path 
                    d="M4 6L8 10L12 6" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </button>

            {/* Accordion Content - Reveal Animation */}
            <motion.div
              initial={false}
              animate={{
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
              }}
              transition={{
                height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: isActive ? 0.1 : 0 },
              }}
              className="overflow-hidden"
            >
              {/* Inner content wrapper - this creates the "reveal" effect */}
              <div className="px-4 pb-4 pt-2">
                {renderPerspectiveContent(perspective.id)}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProjectExpanded = ({ project, onClose }: ProjectExpandedProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll for blur visibility on mobile
  const handleScroll = () => {
    if (!scrollContainerRef.current || !isMobile) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    setShowBottomBlur(scrollHeight - scrollTop - clientHeight > 10);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [isMobile]);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden">
      {/* Top Gradient - positioned so it only blurs content as it exits viewport */}
      <div className="absolute -top-2 left-0 right-0 h-8 md:h-12 md:top-0 bg-linear-to-b from-black to-transparent z-10 pointer-events-none" />

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto md:overflow-hidden flex flex-col scrollbar-hide"
      >
        {/* Hero Section - Fixed on desktop, scrolls with page on mobile */}
        <div className="shrink-0 max-w-4xl mx-auto w-full">
          <ProjectHero project={project} />
        </div>

        {/* Perspectives Section - Scrollable on desktop, flows naturally on mobile */}
        <div className="flex-1 md:min-h-0 max-w-4xl mx-auto w-full px-4 md:px-12 pt-4 md:pt-0">
          <PerspectiveAccordion project={project} isMobile={isMobile} scrollContainerRef={scrollContainerRef} />
        </div>
      </div>

      {/* Bottom Gradient - always visible, fades based on scroll */}
      <div className={`md:hidden absolute -bottom-8 left-0 right-0 h-24 bg-linear-to-t from-black via-black/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
        showBottomBlur ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};
