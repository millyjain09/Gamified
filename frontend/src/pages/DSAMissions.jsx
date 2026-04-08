import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, Bug, Map, BrainCircuit, ShieldAlert } from 'lucide-react';

const DSAMissions = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: '1v1',
      title: "1vs1 Battle",
      desc: "Challenge other coders in real-time algorithm duels. Fastest optimized code wins.",
      icon: <Swords className="w-10 h-10 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />,
      border: "border-rose-500/30 hover:border-rose-400",
      shadow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]",
      bg: "from-rose-900/20",
      route: "/games/algo-arena" // Coming soon
    },
    {
      id: 'debug',
      title: "Debug Code",
      desc: "Find and fix the hidden bugs in broken algorithms to restore the system.",
      icon: <Bug className="w-10 h-10 text-yellow-500 mb-4 group-hover:scale-110 transition-transform" />,
      border: "border-yellow-500/30 hover:border-yellow-400",
      shadow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
      bg: "from-yellow-900/20",
      route: "/games/debug" // Navigates to our new Debug game
    },
    {
      id: 'algovillage',
      title: "AlgoVillage",
      desc: "Build and expand your village by solving progressive data structure challenges.",
      icon: <Map className="w-10 h-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />,
      border: "border-green-500/30 hover:border-green-400",
      shadow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
      bg: "from-green-900/20",
      route: "/games/battle" // Coming soon
    },
    {
      id: 'quiz',
      title: "Quiz & Predict",
      desc: "Rapid-fire output prediction and DSA trivia to test your mental compilation.",
      icon: <BrainCircuit className="w-10 h-10 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />,
      border: "border-cyan-500/30 hover:border-cyan-400",
      shadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
      bg: "from-cyan-900/20",
      route: "/games/predict" // Coming soon
    },
    {
      id: 'interview',
      title: "GraphVilla",
      desc: "The ultimate boss fight. Survive back-to-back mock technical interview questions.",
      icon: <ShieldAlert className="w-10 h-10 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />,
      border: "border-purple-500/30 hover:border-purple-400",
      shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      bg: "from-purple-900/20",
      route: "/games/graph" // Coming soon
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-6 relative overflow-hidden">
      {/* Background Matrix/Grid Effect (Optional, adds to the vibe) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => navigate('/missions')} className="flex items-center gap-2 text-green-400 hover:text-green-300 w-fit mb-8 font-mono">
          <ArrowLeft className="w-5 h-5" /> Back to Selection
        </button>

        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-widest text-green-400 mb-4">
          DSA <span className="text-white">Terminal</span>
        </h1>
        <p className="text-slate-400 font-mono mb-12">Select your game mode to earn XP and level up your logic.</p>

        {/* Dynamic Grid for the 5 games */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div 
              key={game.id} 
              onClick={() => game.route ? navigate(game.route) : alert("This game mode is coming soon! Try Debug Code for now.")}
              className={`group relative cursor-pointer rounded-xl border ${game.border} bg-[#111827] overflow-hidden transition-all duration-300 ${game.shadow} hover:-translate-y-1 flex flex-col`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0`}></div>
              
              <div className="relative z-10 p-8 flex flex-col items-start h-full pointer-events-none">
                {game.icon}
                <h3 className="text-2xl font-bold mb-2 text-slate-100">{game.title}</h3>
                <p className="text-slate-400 text-sm font-mono mb-6 flex-grow">{game.desc}</p>
                
                <button className="w-full py-3 bg-slate-800/50 border border-slate-700 rounded font-bold uppercase tracking-wider group-hover:bg-slate-800 transition-all text-sm pointer-events-auto">
                  Initialize Game
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DSAMissions;