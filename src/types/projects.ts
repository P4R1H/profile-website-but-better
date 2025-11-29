// types/projects.ts - Project-specific type definitions

export type ProjectCategory = "Web" | "ML" | "Infrastructure" | "Mobile" | "Other";

export interface ProductPoint {
  text: string;
  highlight?: string; // Optional bold portion
}

export interface DesignDecision {
  key: string;
  value: string;
}

export interface HostingInfo {
  platform: string;
  icon: string; // skillicons key or local svg path
  reason?: string;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

// Individual perspective types
export interface ProductPerspective {
  tldr: string;
  points: ProductPoint[];
}

export interface EngineeringPerspective {
  summary: string;
  stack: string[]; // skillicons keys
}

export interface DesignPerspective {
  summary?: string;
  decisions: DesignDecision[];
  screenshot?: string; // Project screenshot image path
}

export interface ArchitecturePerspective {
  hosting: HostingInfo[];
  summary?: string;
}

// Main project data structure
export interface ProjectData {
  // Identity
  id: string;
  name: string;
  tagline: string;
  category: ProjectCategory;
  year: string;

  // Hero
  icon?: string; // Icon/logo for the project (displayed on right)
  links?: ProjectLinks;

  // Perspectives (all optional for graceful handling)
  product?: ProductPerspective;
  engineering?: EngineeringPerspective;
  design?: DesignPerspective;
  architecture?: ArchitecturePerspective;

  // Metadata
  isExpandable: boolean;
  isFeatured?: boolean; // For star projects in grid
}

// For the All Projects list
export interface ProjectListItem {
  id: string;
  name: string;
  category: ProjectCategory;
  year: string;
  description: string;
  highlight?: string; // Key metric like "150k users"
  stack?: string[]; // Tech stack icons (skillicons keys)
  isExpandable: boolean;
  projectData?: ProjectData; // Full data if expandable
}

// Perspective type for accordion
export type PerspectiveType = "product" | "engineering" | "design" | "architecture";

export interface PerspectiveConfig {
  id: PerspectiveType;
  label: string;
  available: boolean;
}
