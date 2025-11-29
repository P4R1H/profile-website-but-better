"use client";

import { useState } from "react";
import { EngineeringPerspective as EngineeringPerspectiveType } from "@/types/projects";

interface EngineeringPerspectiveProps {
  data: EngineeringPerspectiveType;
}

// Icons that need local files (not on skillicons.dev)
const localIcons = ["hetzner", "praw", "discordpy", "gemini", "jwt", "pcmci", "scikit", "chrome-api", "react-native"];

// Map custom names to skillicons.dev names
const iconAliases: Record<string, string> = {
  "discordpy": "discord", // fallback if local not found
};

const SkillIcon = ({ skill }: { skill: string }) => {
  const [hasError, setHasError] = useState(false);
  const isLocal = localIcons.includes(skill);
  
  // Try local first for local icons, otherwise use skillicons.dev
  const [src, setSrc] = useState(() => {
    if (isLocal) {
      return `/skillicons/${skill}.svg`;
    }
    return `https://skillicons.dev/icons?i=${skill}`;
  });

  if (hasError) {
    // Show text fallback for missing icons
    return (
      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center text-[8px] md:text-[10px] text-zinc-500 font-mono uppercase">
        {skill}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={skill}
      loading="lazy"
      className="w-8 h-8 md:w-12 md:h-12 object-contain block"
      onError={() => {
        if (isLocal && iconAliases[skill]) {
          // Try skillicons.dev alias
          setSrc(`https://skillicons.dev/icons?i=${iconAliases[skill]}`);
        } else if (src.startsWith("https://skillicons.dev")) {
          // Try local fallback
          setSrc(`/skillicons/${skill}.svg`);
        } else {
          // Give up, show text
          setHasError(true);
        }
      }}
    />
  );
};

export const EngineeringPerspective = ({ data }: EngineeringPerspectiveProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Summary Paragraph */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        {data.summary}
      </p>

      {/* Stack Grid - Responsive sizes */}
      <div className="flex-1">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-1 w-fit">
          {data.stack.map((skill) => (
            <div
              key={skill}
              className="w-12 h-12 md:w-20 md:h-20 bg-zinc-950 border border-zinc-800 flex items-center justify-center hover:border-zinc-600 hover:bg-zinc-900 transition-all"
            >
              <SkillIcon skill={skill} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
