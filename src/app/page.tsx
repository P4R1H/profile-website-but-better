"use client";

import React, { useState } from "react";
import { Tesseract } from "../components/tesseract/Tesseract";
import { MobileScrollContainer } from "../components/tesseract/MobileScrollContainer";
import { Breadcrumb } from "@/components/breadcrumb";
import { rootItems } from "./data/data";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center p-4 md:p-8 md:justify-center">
      <div className="w-full max-w-7xl mb-4 h-12 flex items-center shrink-0 relative z-50 bg-black">
        <Breadcrumb
          path={path}
          rootItems={rootItems}
          onNavigate={setPath}
        />
      </div>

      {/* Mobile View - shown only on mobile */}
      <div className="md:hidden w-full max-w-7xl h-[calc(100vh-6rem)]">
        <MobileScrollContainer
          enableSnap={true}
          enableBlur={true}
          enableHaptics={true}
        >
          <Tesseract
            items={rootItems}
            path={path}
            onNavigate={setPath}
            config={{
              mobile: {
                columns: 1,
                gap: 12,
              },
            }}
          />
        </MobileScrollContainer>
      </div>

      {/* Desktop View - shown only on desktop */}
      <div className="hidden md:block w-full max-w-7xl h-[700px]">
        <Tesseract
          items={rootItems}
          path={path}
          onNavigate={setPath}
          config={{
            columns: 3,
            gap: 8,
            expandDuration: 1.2,
            collapseDuration: 0.8,
          }}
        />
      </div>
    </main>
  );
}