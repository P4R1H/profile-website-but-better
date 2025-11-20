"use client";

import React, { useState } from "react";
import { Tesseract } from "../components/tesseract/Tesseract"; 
import { Breadcrumb } from "@/components/breadcrumb"; 
import { rootItems } from "./data/data";

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mb-4 h-8 flex items-center">
        <Breadcrumb 
          path={path} 
          rootItems={rootItems} 
          onNavigate={setPath} 
        />
      </div>
      
      <div className="w-full max-w-7xl h-[700px]">
        <Tesseract 
          items={rootItems} 
          path={path} 
          onNavigate={setPath}
        />
      </div>
    </main>
  );
}