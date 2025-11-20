"use client";

import React, { useState } from "react";
import { Tesseract } from "../components/tesseract/Tesseract"; 
import { TesseractCellData } from '@/types';
import { Breadcrumb } from "@/components/breadcrumb"; 

// --- Example Special Card Components ---

const TerminalUI = ({ onClose, cell }: { onClose: () => void; cell: TesseractCellData }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Welcome to the Terminal Interface",
    "Type 'help' for available commands",
  ]);

  const handleCommand = (cmd: string) => {
    const newHistory = [...history, `$ ${cmd}`];
    
    if (cmd === "help") {
      newHistory.push("Available commands: help, clear, about, exit");
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (cmd === "about") {
      newHistory.push(`This is ${cell.title} - ${cell.subtitle}`);
    } else if (cmd === "exit") {
      onClose();
      return;
    } else if (cmd.trim()) {
      newHistory.push(`Command not found: ${cmd}`);
    }
    
    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="w-full h-full bg-black border border-emerald-500/30 flex flex-col font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between">
        <span className="text-emerald-400">terminal@{cell.id}</span>
        <button 
          onClick={onClose}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          [ESC]
        </button>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="text-emerald-400">
            {line}
          </div>
        ))}
      </div>
      
      {/* Terminal Input */}
      <div className="border-t border-emerald-500/30 p-4 flex items-center gap-2">
        <span className="text-emerald-400">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommand(input);
            if (e.key === "Escape") onClose();
          }}
          className="flex-1 bg-transparent text-emerald-400 outline-none"
          placeholder="Type command..."
          autoFocus
        />
      </div>
    </div>
  );
};

const SnakeGame = ({ onClose }: { onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="w-full h-full bg-black border border-purple-500/30 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-purple-400">🐍 SNAKE</h2>
          <p className="text-zinc-500 font-mono text-sm">Classic Game</p>
        </div>
        
        {!gameStarted ? (
          <button
            onClick={() => setGameStarted(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            START GAME
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-purple-400 font-bold">{score}</div>
            <p className="text-zinc-400 text-sm">Score</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setScore(score + 10);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                +10
              </button>
              <button
                onClick={() => {
                  setGameStarted(false);
                  setScore(0);
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-6 rounded transition-colors"
              >
                RESET
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-400 text-sm transition-colors"
        >
          [ESC to close]
        </button>
      </div>
    </div>
  );
};

const ImageGallery = ({ onClose }: { onClose: () => void }) => {
  const images = [
    { id: 1, emoji: "🌄", title: "Mountain" },
    { id: 2, emoji: "🏖️", title: "Beach" },
    { id: 3, emoji: "🌆", title: "City" },
    { id: 4, emoji: "🌲", title: "Forest" },
  ];

  return (
    <div className="w-full h-full bg-black border border-blue-500/30 flex flex-col">
      {/* Gallery Header */}
      <div className="bg-blue-950/50 border-b border-blue-500/30 px-4 py-3 flex items-center justify-between">
        <span className="text-blue-400 font-mono">Photo Gallery</span>
        <button 
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          [CLOSE]
        </button>
      </div>
      
      {/* Gallery Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl">{img.emoji}</div>
            <p className="text-zinc-400 text-sm">{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Dummy Data for Recursion ---

const experienceItems: TesseractCellData[] = [
  { 
    id: "cred", 
    title: "CRED", 
    subtitle: "Backend Intern", 
    content: <div className="text-zinc-500 text-xs">Wealth Management</div>,
    rowSpan: 2 
  },
  { 
    id: "hpe", 
    title: "HPE", 
    subtitle: "Project Intern", 
    content: <div className="text-zinc-500 text-xs">Infrastructure</div> 
  },
  { 
    id: "ecom", 
    title: "Ecom Express", 
    subtitle: "ML Intern", 
    content: <div className="text-zinc-500 text-xs">Computer Vision</div> 
  },
  { 
    id: "conscent", 
    title: "Conscent", 
    subtitle: "Data Science", 
    content: <div className="text-zinc-500 text-xs">Big Data</div> 
  },
  { 
    id: "persona", 
    title: "Persona", 
    subtitle: "Team Lead", 
    content: <div className="text-zinc-500 text-xs">Full Stack</div> 
  },
];

const projectItems: TesseractCellData[] = [
  { id: "stockpiece", title: "StockPiece", subtitle: "Fintech Game" },
  { id: "skilljourney", title: "Skill Journey", subtitle: "AI EdTech" },
  { id: "bots", title: "Community Bots", subtitle: "Automation" },
  {
    id: "chat-terminal",
    title: "Chat Terminal",
    subtitle: "Interactive CLI",
    // Custom expansion - opens terminal UI
    renderExpanded: ({ onClose, cell }) => <TerminalUI onClose={onClose} cell={cell} />,
  },
  {
    id: "snake",
    title: "Snake Game",
    subtitle: "Play Now!",
    // Custom expansion - opens game
    renderExpanded: ({ onClose }) => <SnakeGame onClose={onClose} />,
  },
];

const rootItems: TesseractCellData[] = [
  { 
    id: "profile", 
    title: "Parth Gupta", 
    subtitle: "Full Stack Developer", 
    content: <div className="text-sm text-zinc-400 mt-2">Building things that matter.</div>,
    rowSpan: 2 
  },
  { 
    id: "exp", 
    title: "Experience", 
    subtitle: "My Journey", 
    children: experienceItems 
  },
  { 
    id: "projects", 
    title: "Projects", 
    subtitle: "What I've Built", 
    children: projectItems 
  },
  { 
    id: "stack", 
    title: "Stack", 
    subtitle: "My Arsenal" 
  },
  { 
    id: "connect", 
    title: "Connect", 
    subtitle: "Reach Out" 
  },
  { 
    id: "blog", 
    title: "Blog", 
    subtitle: "Thoughts" 
  },
  {
    id: "photos",
    title: "Photos",
    subtitle: "Gallery",
    renderExpanded: ({ onClose }) => <ImageGallery onClose={onClose} />,
  },
  { 
    id: "extra", 
    title: "Extra", 
    subtitle: "More Stuff",
    isLeaf: true, // Won't be clickable
    content: <div className="text-zinc-600 text-xs mt-2">This is a leaf node</div>
  },
  { 
    id: "extra2", 
    title: "Misc", 
    subtitle: "Details" 
  },
];

export default function Home() {
  const [path, setPath] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-black p-8 flex flex-col items-center justify-center">
      {/* Breadcrumb Navigation */}
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