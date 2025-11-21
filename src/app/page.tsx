"use client";

import React, { useState } from "react";
import { Tesseract } from "../components/tesseract/Tesseract";
import { MobileScrollContainer } from "../components/tesseract/MobileScrollContainer";
import { Breadcrumb } from "@/components/breadcrumb";
import { rootItems } from "./data/data";
import { useMobileDetection } from "@/hooks/useMobileDetection";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);
  const { isMobile } = useMobileDetection();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl mb-4 h-8 flex items-center">
        <Breadcrumb
          path={path}
          rootItems={rootItems}
          onNavigate={setPath}
        />
      </div>

      <div className="w-full max-w-7xl h-[calc(100vh-8rem)] md:h-[700px]">
        {isMobile ? (
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
                  enableHaptics: true,
                  snapScroll: true,
                  blurEdges: true,
                  horizontalPadding: 16,
                },
              }}
            />
          </MobileScrollContainer>
        ) : (
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
        )}
      </div>
    </main>
  );
}