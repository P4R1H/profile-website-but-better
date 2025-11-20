import React, { useState } from "react";
import { TesseractCellData } from '@/types';

// --- Terminal Component ---
export const TerminalUI = ({ onClose, cell }: { onClose: () => void; cell: TesseractCellData }) => {
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
      <div className="bg-emerald-950/50 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between">
        <span className="text-emerald-400">terminal@{cell.id}</span>
        <button 
          onClick={onClose}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          [ESC]
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="text-emerald-400">
            {line}
          </div>
        ))}
      </div>
      
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

// --- Snake Game Component ---
export const SnakeGame = ({ onClose }: { onClose: () => void }) => {
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

// --- Image Gallery Component ---
export const ImageGallery = ({ onClose }: { onClose: () => void }) => {
  const images = [
    { id: 1, emoji: "🌄", title: "Mountain" },
    { id: 2, emoji: "🖼️", title: "Beach" },
    { id: 3, emoji: "🌆", title: "City" },
    { id: 4, emoji: "🌲", title: "Forest" },
  ];

  return (
    <div className="w-full h-full bg-black border border-blue-500/30 flex flex-col">
      <div className="bg-blue-950/50 border-b border-blue-500/30 px-4 py-3 flex items-center justify-between">
        <span className="text-blue-400 font-mono">Photo Gallery</span>
        <button 
          onClick={onClose}
          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          [CLOSE]
        </button>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-auto">
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