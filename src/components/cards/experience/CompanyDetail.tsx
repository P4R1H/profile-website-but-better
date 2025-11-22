"use client";

import { motion } from "framer-motion";

interface CompanyData {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  stack: string[];
}

interface CompanyDetailProps {
  data: CompanyData;
  onClose: () => void;
}

// Map tech names to skillicons IDs
const techToSkillIcon = (tech: string): string | null => {
  const mapping: Record<string, string | null> = {
    "Go": "go",
    "Java": "java",
    "JavaScript": "js",
    "AWS": "aws",
    "Python": "py",
    "NextJS": "nextjs",
    "RabbitMQ": "rabbitmq",
    "TensorFlow": "tensorflow",
    "Keras": "keras",
    "FastAPI": "fastapi",
    "MongoDB": "mongodb",
    "RedfishES": null, // No icon available
    "ClickHouse": null, // No icon available
  };

  return mapping[tech] ?? tech.toLowerCase();
};

export const CompanyDetail = ({ data }: CompanyDetailProps) => {
  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* No motion.div - parent TesseractCell already handles animations */}
      <div className="w-full h-full overflow-y-auto scrollbar-hide">
        {/* Centered container for desktop, full-width on mobile */}
        <div className="w-full md:max-w-2xl md:mx-auto">
          {/* Company Info Section */}
          <div className="p-6">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 uppercase tracking-tight leading-none">
              {data.company}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base font-mono mt-2">
              {data.role}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs md:text-sm text-zinc-500 font-mono">
              <span>{data.location}</span>
              <span className="text-zinc-800">•</span>
              <span>{data.period}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Description Section */}
          <div className="p-6">
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Highlights Section */}
          <div className="p-6">
            <div className="space-y-4">
              {data.highlights.map((highlight, index) => {
                const [title, ...rest] = highlight.split(":");
                const description = rest.join(":").trim();

                return (
                  <div key={index} className="text-sm md:text-base">
                    <div className="text-zinc-500 font-mono text-xs uppercase tracking-wider mb-1">
                      {title}
                    </div>
                    <div className="text-zinc-300">
                      {description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Tech Stack Section */}
          <div className="p-6 pb-12">
            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-4">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.stack.map((tech) => {
                const iconId = techToSkillIcon(tech);

                // If no icon available, show text badge
                if (!iconId) {
                  return (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono"
                    >
                      {tech}
                    </span>
                  );
                }

                // Show skillicon
                return (
                  <div
                    key={tech}
                    className="w-12 h-12 md:w-14 md:h-14 bg-zinc-950 border border-zinc-800 flex items-center justify-center"
                  >
                    <img
                      src={`https://skillicons.dev/icons?i=${iconId}`}
                      alt={tech}
                      loading="lazy"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
