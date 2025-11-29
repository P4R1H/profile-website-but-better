"use client";

import { ProductPerspective as ProductPerspectiveType } from "@/types/projects";

interface ProductPerspectiveProps {
  data: ProductPerspectiveType;
}

export const ProductPerspective = ({ data }: ProductPerspectiveProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* TL;DR - Bold Heading */}
      <div className="mb-6">
        <h4 className="text-zinc-100 font-bold text-lg md:text-xl leading-relaxed">
          {data.tldr}
        </h4>
      </div>

      {/* Bullet Points */}
      <ul className="space-y-3 flex-1">
        {data.points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed">
            <span className="mt-2 w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
            <span>
              {point.highlight ? (
                <>
                  <span className="text-zinc-200 font-medium">{point.highlight}</span>
                  {" "}
                  {point.text}
                </>
              ) : (
                point.text
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
