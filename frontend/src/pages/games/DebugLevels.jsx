import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock, Clock, FileQuestion } from 'lucide-react';

const DebugLevels = () => {
  const navigate = useNavigate();
  
  // 🚀 NAYA: Component load hote hi local storage se latest level read karega
  const [highestUnlocked, setHighestUnlocked] = useState(() => {
    return parseInt(localStorage.getItem('debugHighestLevel')) || 1;
  });

  const levels = [
    { id: 1, title: "Level 1 - Beginner", concept: "Basic syntax & simple logical errors", timer: 60, qCount: 5, color: "text-green-500", border: "border-green-500/50", bg: "bg-green-500/10" },
    { id: 2, title: "Level 2 - Easy Logic", concept: "Basic algorithm logic errors", timer: 90, qCount: 5, color: "text-yellow-500", border: "border-yellow-500/50", bg: "bg-yellow-500/10" },
    { id: 3, title: "Level 3 - Intermediate", concept: "Algorithm mistakes (Binary Search, Recursion)", timer: 120, qCount: 7, color: "text-orange-500", border: "border-orange-500/50", bg: "bg-orange-500/10" },
    { id: 4, title: "Level 4 - Advanced", concept: "Complex bugs (Trees, Linked Lists, DFS/BFS)", timer: 150, qCount: 7, color: "text-red-500", border: "border-red-500/50", bg: "bg-red-500/10" },
    { id: 5, title: "Level 5 - Expert Mode", concept: "Competitive coding (DP, Graphs, Greedy)", timer: 180, qCount: 10, color: "text-purple-500", border: "border-purple-500/50", bg: "bg-purple-500/10" }
  ];

  const handleLevelClick = (levelId) => {
    if (levelId <= highestUnlocked) {
      navigate(`/games/debug/arena`, { state: { levelId } });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-6 font-sans relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate('/dsa-missions')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Terminal
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black italic uppercase tracking-widest text-white">Debug <span className="text-cyan-400">Protocol</span></h1>
            <p className="text-slate-400 font-mono text-sm">Select difficulty to initialize Gemini engine</p>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid gap-6">
          {levels.map((level) => {
            const isUnlocked = level.id <= highestUnlocked;
            
            return (
              <div 
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={`relative flex items-center p-6 rounded-xl border transition-all duration-300 ${
                  isUnlocked 
                    ? `${level.border} ${level.bg} cursor-pointer hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]` 
                    : 'border-slate-800 bg-[#111827] opacity-60 cursor-not-allowed grayscale'
                }`}
              >
                {/* Lock/Unlock Icon */}
                <div className="mr-6">
                  {isUnlocked ? (
                    <Unlock className={`w-8 h-8 ${level.color}`} />
                  ) : (
                    <Lock className="w-8 h-8 text-slate-600" />
                  )}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold uppercase tracking-wide mb-1 ${isUnlocked ? level.color : 'text-slate-500'}`}>
                    {level.title}
                  </h2>
                  <p className="text-slate-400 font-mono text-sm">{level.concept}</p>
                </div>

                {/* Stats (Timer & Questions) */}
                <div className="hidden md:flex gap-6 text-slate-300 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-500" /> {level.timer}s / q
                  </div>
                  <div className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-rose-500" /> {level.qCount} Questions
                  </div>
                </div>

                {/* Play Button Indicator */}
                {isUnlocked && (
                  <div className={`ml-8 px-6 py-2 rounded uppercase font-bold text-sm tracking-wider border ${level.border} ${level.color} hover:bg-white/5 transition-colors hidden sm:block`}>
                    Initialize
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default DebugLevels;