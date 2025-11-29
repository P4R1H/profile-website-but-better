"use client";

import { useState } from "react";
import { ArchitecturePerspective as ArchitecturePerspectiveType } from "@/types/projects";

interface ArchitecturePerspectiveProps {
  data: ArchitecturePerspectiveType;
}

const localIcons = ["hetzner"];

const PlatformIcon = ({ icon }: { icon: string }) => {
  const [src, setSrc] = useState(() => {
    // Check if it's a local SVG path
    if (icon.startsWith("/")) {
      return icon;
    }
    if (localIcons.includes(icon)) {
      return `/skillicons/${icon}.svg`;
    }
    return `https://skillicons.dev/icons?i=${icon}`;
  });

  return (
    <img
      src={src}
      alt={icon}
      loading="lazy"
      className="w-8 h-8 md:w-10 md:h-10 object-contain block"
      onError={() => {
        if (src.startsWith("https://skillicons.dev")) {
          setSrc(`/skillicons/${icon}.svg`);
        }
      }}
    />
  );
};

export const ArchitecturePerspective = ({ data }: ArchitecturePerspectiveProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Optional Summary */}
      {data.summary && (
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {data.summary}
        </p>
      )}

      {/* Hosting Info */}
      <div className="flex-1 space-y-4">
        {data.hosting.map((host, i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 p-3 bg-zinc-950 border border-zinc-800"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 border border-zinc-800">
              <PlatformIcon icon={host.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-zinc-200 text-sm font-medium block">
                {host.platform}
              </span>
              {host.reason && (
                <span className="text-zinc-500 text-xs block mt-0.5">
                  {host.reason}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
