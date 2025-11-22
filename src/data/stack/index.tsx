import { TesseractCellData } from "@/types/types";
import { StackPreview } from "@/components/cards/stack/StackPreview";
import { StackExpanded } from "@/components/cards/stack/StackExpanded";

export const stackSkills = {
  languages: ["cpp", "c", "java", "py", "go", "ts", "js", "kotlin"],
  frameworks: ["html", "css", "react", "nextjs", "vite", "nodejs", "fastapi", "tensorflow"],
  tools: ["git", "githubactions", "docker", "vscode", "bash", "linux", "postman", "raspberrypi"],
  databases: ["mongodb", "mysql", "redis", "aws", "gcp", "cloudflare", "androidstudio"],
};

export const allSkills = Object.values(stackSkills).flat();

export const skillCategories: Record<string, { word1: string; word2: string }> = {
  // Languages
  cpp: { word1: "C++", word2: "Systems" },
  c: { word1: "C", word2: "Low-level" },
  java: { word1: "Java", word2: "Enterprise" },
  py: { word1: "Python", word2: "Backend" },
  go: { word1: "Go", word2: "Performance" },
  ts: { word1: "TypeScript", word2: "Frontend" },
  js: { word1: "JavaScript", word2: "Web" },
  kotlin: { word1: "Kotlin", word2: "Mobile" },
  
  // Frameworks
  html: { word1: "HTML", word2: "Structure" },
  css: { word1: "CSS", word2: "Styling" },
  react: { word1: "React", word2: "UI" },
  nextjs: { word1: "Next.js", word2: "Fullstack" },
  vite: { word1: "Vite", word2: "Tooling" },
  nodejs: { word1: "Node.js", word2: "Runtime" },
  fastapi: { word1: "FastAPI", word2: "APIs" },
  tensorflow: { word1: "TensorFlow", word2: "ML" },
  
  // Tools
  git: { word1: "Git", word2: "Version Control" },
  githubactions: { word1: "GitHub Actions", word2: "CI/CD" },
  docker: { word1: "Docker", word2: "Containers" },
  vscode: { word1: "VS Code", word2: "Development" },
  bash: { word1: "Bash", word2: "Scripting" },
  linux: { word1: "Linux", word2: "Infrastructure" },
  postman: { word1: "Postman", word2: "Testing" },
  raspberrypi: { word1: "Raspberry Pi", word2: "Hardware" },
  
  // Databases & Cloud
  mongodb: { word1: "MongoDB", word2: "NoSQL" },
  mysql: { word1: "MySQL", word2: "Relational" },
  redis: { word1: "Redis", word2: "Caching" },
  aws: { word1: "AWS", word2: "Cloud" },
  gcp: { word1: "GCP", word2: "Cloud" },
  cloudflare: { word1: "Cloudflare", word2: "Edge" },
  androidstudio: { word1: "Android Studio", word2: "Mobile" },
};

export const stackCell: TesseractCellData = {
  id: "stack",
  title: "STACK",
  subtitle: "Jack of all trades, master of some.",
  content: <StackPreview />,
  renderExpanded: ({ onClose }) => <StackExpanded onClose={onClose} />,
};