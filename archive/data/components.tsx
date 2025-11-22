import React, { useState } from "react";
import { TesseractCellData } from '@/types/types';

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
import {useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons (Inline for portability) ---
const Icons = {
  X: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Cpu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>,
  Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Server: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>,
};

interface SystemMonitorProps {
  onClose: () => void;
}

export const SystemMonitor = ({ onClose }: SystemMonitorProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'logs'>('overview');
  const [isReady, setIsReady] = useState(false);

  // RULE #3: The "0.2s" Content Delay
  // We simulate "heavy" chart initialization. 
  // If we render this immediately, the layout projection might skew the grid.
  // Waiting ~600ms ensures the container has mostly stabilized before we render complex DOM.
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data generation for "Heavy" content
  const serverNodes = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    load: Math.random() * 100,
    status: Math.random() > 0.9 ? 'error' : 'active'
  })), []);

  return (
    // RULE #1: Fluid Geometry & RULE #2: Overflow Discipline
    // w-full, h-full, absolute/relative positioning, overflow-hidden on root.
    <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-100 relative overflow-hidden font-mono">
      
      {/* --- HEADER SECTION --- */}
      {/* Fades in slightly delayed to avoid the initial "stretch" visual artifacts */}
      <motion.div 
        className="flex items-start justify-between p-6 border-b border-zinc-800 shrink-0 bg-zinc-950/50 backdrop-blur-sm z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-3">
              <Icons.Cpu />
              Nexus Core V.9
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">System Operational</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-1">
            {['overview', 'nodes', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={(e) => {
                  e.stopPropagation(); // RULE #4: Prevent bubbling
                  setActiveTab(tab as any);
                }}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded-sm transition-colors ${
                  activeTab === tab 
                    ? 'bg-zinc-100 text-zinc-950 font-bold' 
                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* RULE #4: Wired "Back" Functionality */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onClose();
          }}
          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors group"
        >
          <Icons.X />
        </button>
      </motion.div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* Flex-1 to take remaining space. Overflow-y-auto handles internal scrolling. */}
      <div className="flex-1 overflow-hidden relative bg-zinc-900/30">
        <AnimatePresence mode="wait">
          {!isReady ? (
             // SKELETON LOADER (Displayed during expansion animation)
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-6 grid grid-cols-3 gap-4"
            >
               {[1,2,3].map(i => (
                 <div key={i} className="bg-zinc-900/50 rounded-lg animate-pulse h-full" />
               ))}
            </motion.div>
          ) : (
            // ACTUAL HEAVY CONTENT (Displayed after layout stabilizes)
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  {/* Simulated Chart 1 */}
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm text-zinc-400 uppercase">CPU Thread Distribution</h3>
                      <Icons.Activity />
                    </div>
                    <div className="flex-1 flex items-end gap-1 h-32">
                       {Array.from({ length: 20 }).map((_, i) => (
                         <motion.div 
                           key={i}
                           className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-colors rounded-t-sm"
                           initial={{ height: '0%' }}
                           animate={{ height: `${Math.random() * 100}%` }}
                           transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                         />
                       ))}
                    </div>
                  </div>
                  
                  {/* Simulated Chart 2 */}
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                      <h3 className="text-sm text-zinc-400 uppercase">Memory Allocation</h3>
                      <Icons.Server />
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`rounded-sm ${i < 12 ? 'bg-zinc-800' : 'bg-zinc-700/30'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Long text to test scrolling overflow */}
                  <div className="col-span-1 md:col-span-2 bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-500">
                    <p className="mb-2 text-zinc-300">&gt; SYSTEM_DIAGNOSTIC_TOOL initiated...</p>
                    <p className="mb-1">&gt; Checking volumetric integrity... [OK]</p>
                    <p className="mb-1">&gt; Re-calibrating layout engine... [OK]</p>
                    <p className="mb-1">&gt; Framer Motion delta projection... [SYNCED]</p>
                    <p className="mb-1 text-yellow-500">&gt; Warning: Heavy component load detected.</p>
                    <p className="mb-1">&gt; Applying stabilization protocol (delay: 600ms)...</p>
                    <p className="text-emerald-500">&gt; COMPONENT MOUNT SUCCESSFUL.</p>
                  </div>
                </div>
              )}

              {activeTab === 'nodes' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {serverNodes.map((node) => (
                    <motion.div 
                      key={node.id}
                      className={`p-3 rounded border ${node.status === 'error' ? 'border-red-900/50 bg-red-900/10' : 'border-zinc-800 bg-zinc-900'}`}
                      whileHover={{ scale: 1.02 }}
                    >
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-xs text-zinc-500">NODE_{node.id.toString().padStart(2, '0')}</span>
                         <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                       </div>
                       <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-zinc-400 h-full" style={{ width: `${node.load}%` }} />
                       </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
               {activeTab === 'logs' && (
                 <div className="space-y-1 font-mono text-xs text-zinc-400">
                   {Array.from({length: 50}).map((_, i) => (
                     <div key={i} className="border-b border-zinc-800/50 py-1 flex gap-4 hover:bg-zinc-900/50 px-2">
                       <span className="text-zinc-600">10:24:{i.toString().padStart(2, '0')}</span>
                       <span>Packet transmission sequence {1000 + i} acknowledged.</span>
                     </div>
                   ))}
                 </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status Bar */}
      <motion.div 
        className="h-8 border-t border-zinc-800 bg-zinc-950 flex items-center px-6 justify-between text-[10px] uppercase text-zinc-600 tracking-widest shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span>Memory: 64TB</span>
        <span>Uptime: 99.99%</span>
      </motion.div>
    </div>
  );
};