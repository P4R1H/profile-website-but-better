"use client";

import React, { useState } from "react";
import { Tesseract } from "../components/tesseract/Tesseract";
import { Breadcrumb } from "@/components/breadcrumb";
import { rootItems } from "./data/data";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="h-dvh bg-black overflow-hidden flex flex-col">
      {/* Breadcrumb - fixed at top */}
      <div className="flex-shrink-0 px-4 md:px-8 pt-4 md:pt-8 pb-2">
        <div className="w-full max-w-7xl mx-auto">
          <Breadcrumb
            path={path}
            rootItems={rootItems}
            onNavigate={setPath}
          />
        </div>
      </div>

      {/* Tesseract container - takes remaining vertical space */}
      <div className="flex-1 px-4 md:px-8 pb-4 md:pb-8 min-h-0">
        <div className="w-full max-w-7xl h-full mx-auto">
          <Tesseract
            items={rootItems}
            path={path}
            onNavigate={setPath}
          />
        </div>
      </div>
    </main>
  );
}