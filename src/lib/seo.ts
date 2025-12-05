import { thoughtsList } from "@/data/thoughts";

// Path segment to display name mapping
const pathNames: Record<string, string> = {
  // Root sections
  me: "About",
  experience: "Experience",
  projects: "Projects",
  stack: "Tech Stack",
  thoughts: "Thoughts",
  wins: "Wins",
  connect: "Connect",

  // Experience children
  cred: "CRED",
  hpe: "HPE",
  ecom: "Ecom Express",
  conscent: "ConsCent",
  persona: "Persona",

  // Project children
  stockpiece: "StockPiece",
  moderation: "Moderation Bot",
  skilljourney: "Skill Journey",
  bots: "Discord Bots",
};

// Path segment to description mapping
const pathDescriptions: Record<string, string> = {
  // Root sections
  me: "Hi, I'm Parth. A generalist builder working towards becoming a general specialist.",
  experience: "My professional journey through startups, unicorns, and MNCs.",
  projects: "A collection of things I've built - from fantasy stock markets to AI tools.",
  stack: "Technologies and tools I work with.",
  thoughts: "My thoughts, blog posts, and interview experiences.",
  wins: "Achievements and milestones along the way.",
  connect: "Get in touch with me.",

  // Experience children
  cred: "Backend Intern at CRED, building wealth management platform from scratch.",
  hpe: "Software Developer Intern at Hewlett Packard Enterprise.",
  ecom: "Product Intern at Ecom Express, working on logistics tech.",
  conscent: "My first internship building AI-driven analytics.",
  persona: "Building creator economy infrastructure at Persona.",

  // Project children
  stockpiece: "A fantasy stock market for One Piece fans with 140,000+ users worldwide.",
  moderation: "Discord moderation bot handling 2M+ events across major servers.",
  skilljourney: "AI-powered skill development roadmap generator.",
  bots: "Collection of Discord bots and automation tools.",
};

export interface PageMetadata {
  title: string;
  description: string;
}

/**
 * Get metadata for a given path
 */
export function getMetadataForPath(path: string[]): PageMetadata {
  const baseName = "Parth Gupta";
  
  if (path.length === 0) {
    return {
      title: baseName,
      description: "Minimal, clean portfolio website. A generalist builder working towards becoming a general specialist.",
    };
  }

  // Check if it's a thought/blog post
  if (path[0] === "thoughts" && path.length === 2) {
    const thought = thoughtsList.find(t => t.id === path[1]);
    if (thought) {
      return {
        title: `${thought.title} | ${baseName}`,
        description: thought.content.slice(0, 155) + (thought.content.length > 155 ? "..." : ""),
      };
    }
  }

  // Build title from path segments
  const titleParts = path.map(segment => pathNames[segment] || segment).reverse();
  const title = `${titleParts.join(" · ")} | ${baseName}`;

  // Get description from deepest segment
  const lastSegment = path[path.length - 1];
  const description = pathDescriptions[lastSegment] || `${pathNames[lastSegment] || lastSegment} - ${baseName}`;

  return { title, description };
}

/**
 * Get title for analytics tracking
 */
export function getTitleForPath(path: string[]): string {
  if (path.length === 0) return "Home";
  
  // Check if it's a thought/blog post
  if (path[0] === "thoughts" && path.length === 2) {
    const thought = thoughtsList.find(t => t.id === path[1]);
    if (thought) return thought.title;
  }

  return path.map(segment => pathNames[segment] || segment).join(" > ");
}

/**
 * Generate all static paths for pre-rendering
 */
export function getAllStaticPaths(): string[][] {
  const paths: string[][] = [
    [], // Root
    // Root sections
    ["me"],
    ["experience"],
    ["projects"],
    ["stack"],
    ["thoughts"],
    ["wins"],
    // Experience children
    ["experience", "cred"],
    ["experience", "hpe"],
    ["experience", "ecom"],
    ["experience", "conscent"],
    ["experience", "persona"],
    // Project children (expandable ones)
    ["projects", "stockpiece"],
    ["projects", "moderation"],
    ["projects", "persona"],
    ["projects", "skilljourney"],
  ];

  // Add all thoughts
  thoughtsList.forEach(thought => {
    paths.push(["thoughts", thought.id]);
  });

  return paths;
}
