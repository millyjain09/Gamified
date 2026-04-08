import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, ArrowLeft, Terminal } from 'lucide-react';

const MissionSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-6 flex flex-col">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 w-fit mb-8 font-mono">
        <ArrowLeft className="w-5 h-5" /> Back to Base
      </button>

      <h1 className="text-4xl md:text-5xl font-black italic text-center uppercase tracking-widest mb-12">
        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Destiny</span>
      </h1>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {/* DSA Column - Navigates to DSA Missions */}
        <div 
          onClick={() => navigate('/dsa-missions')}
          className="group relative cursor-pointer rounded-2xl border border-green-500/30 overflow-hidden hover:border-green-400 transition-all duration-300 hover:shadow-[0_0_50px_rgba(74,222,128,0.2)] hover:-translate-y-2 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-black z-0"></div>
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center">
            <Terminal className="w-24 h-24 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black italic uppercase tracking-wider text-green-400 mb-4">Data Structures & Algorithms</h2>
            <p className="text-slate-300 font-mono">Master the logic. Optimize the core. Conquer the coding interviews.</p>
          </div>
        </div>

        {/* Full Stack Column - Coming Soon */}
        <div 
                   onClick={() => navigate('/full-stack')}

          className="group relative cursor-pointer rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-400 transition-all duration-300 hover:shadow-[0_0_50px_rgba(192,132,252,0.2)] hover:-translate-y-2 flex flex-col"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black z-0"></div>
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-center">
            <Server className="w-24 h-24 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-black italic uppercase tracking-wider text-purple-400 mb-4">Full Stack Development</h2>
            <p className="text-slate-300 font-mono">Build the architecture. Design the interface. Rule the web (MERN).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSelection;