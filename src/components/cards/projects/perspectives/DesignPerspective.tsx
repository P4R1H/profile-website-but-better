"use client";

import { DesignPerspective as DesignPerspectiveType } from "@/types/projects";

interface DesignPerspectiveProps {
  data: DesignPerspectiveType;
}

export const DesignPerspective = ({ data }: DesignPerspectiveProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Optional Summary */}
      {data.summary && (
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          {data.summary}
        </p>
      )}

      {/* Content: Key-Value Pairs + Screenshot side by side on desktop */}
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Key-Value Pairs */}
        <div className="flex-1 space-y-4">
          {data.decisions.map((decision, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-zinc-600 font-mono text-xs uppercase tracking-wider">
                {decision.key}
              </span>
              <span className="text-zinc-200 text-sm font-medium">
                {decision.value}
              </span>
            </div>
          ))}
        </div>

        {/* Screenshot */}
        {data.screenshot && (
          <div className="md:w-1/2 shrink-0">
            <div className="border border-zinc-800 bg-zinc-950 p-2">
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={data.screenshot}
                  alt="Project screenshot"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
