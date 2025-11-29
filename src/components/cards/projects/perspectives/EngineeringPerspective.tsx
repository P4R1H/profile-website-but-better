"use client";

import { useState } from "react";
import { EngineeringPerspective as EngineeringPerspectiveType } from "@/types/projects";

interface EngineeringPerspectiveProps {
  data: EngineeringPerspectiveType;
}

const localIcons = ["hetzner"];

const SkillIcon = ({ skill }: { skill: string }) => {
  const [src, setSrc] = useState(() => {
    if (localIcons.includes(skill)) {
      return `/skillicons/${skill}.svg`;
    }
    return `https://skillicons.dev/icons?i=${skill}`;
  });

  return (
    <img
      src={src}
      alt={skill}
      loading="lazy"
      className="w-8 h-8 md:w-12 md:h-12 object-contain block"
      onError={() => {
        if (src.startsWith("https://skillicons.dev")) {
          setSrc(`/skillicons/${skill}.svg`);
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
