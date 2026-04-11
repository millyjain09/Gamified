import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // ✅ FIX (missing import)

const FullStackMissions = () => {
  const navigate = useNavigate();

  const missions = [
    { 
      id: "code-race", 
      title: "Code Race", 
      type: "Multiplayer API Battle", 
      desc: "Compete with other players by completing fullstack tasks like API integration, form handling, and frontend-backend sync faster than everyone.", 
      xp: 120, 
      color: "border-red-500 hover:shadow-red-500/50 text-red-400",
      path: "/games/code-race"
    },
    { 
      id: "code-runner", 
      title: "Code Runner", 
      type: "Frontend + API Decisions", 
      desc: "Run through obstacles by choosing correct API calls, validation logic, and frontend actions in real-time.", 
      xp: 80, 
      color: "border-yellow-500 hover:shadow-yellow-500/50 text-yellow-400",
      path: "/games/code-runner"
    },
    { 
      id: "dev-survivor", 
      title: "Dev Survivor", 
      type: "Fullstack Progression", 
      desc: "Level up from beginner to pro by building real features like auth systems, CRUD apps, and dynamic UI.", 
      xp: 150, 
      color: "border-green-500 hover:shadow-green-500/50 text-green-400",
      path: "/games/dev-survivor"
    },
    { 
      id: "git-quest", 
      title: "Git Quest", 
      type: "Version Control", 
      desc: "Master Git by completing missions like commits, branching, merging, and resolving conflicts.", 
      xp: 100, 
      color: "border-purple-500 hover:shadow-purple-500/50 text-purple-400",
      path: "/games/git-quest"
    },
    { 
      id: "code-arena", 
      title: "Code Arena", 
      type: "Real-time Battle", 
      desc: "Enter the arena and fight using fullstack skills. Solve tasks faster to attack opponents and survive.", 
      xp: 200, 
      color: "border-blue-500 hover:shadow-blue-500/50 text-blue-400",
      path: "/games/code-arena"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] p-8 md:p-12 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* 🔙 Back Button */}
        <button 
          onClick={() => navigate('/missions')} 
          className="flex items-center gap-2 text-green-400 hover:text-green-300 w-fit mb-8 font-mono"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Selection
        </button>

        {/* 🔥 Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4 tracking-wider uppercase drop-shadow-lg">
            Full Stack Arena
          </h1>
          <p className="text-lg text-gray-400">
            Choose your game. Build real features. Earn XP.
          </p>
        </div>

        {/* 🎮 Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missions.map((mission) => (
            <div 
              key={mission.id} 
              className={`relative bg-[#161b22] p-6 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between ${mission.color}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full text-gray-300">
                    {mission.type}
                  </span>
                  <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/20">
                    +{mission.xp} XP
                  </span>
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-white">
                  {mission.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {mission.desc}
                </p>
              </div>
              
              <button 
                onClick={() => navigate(mission.path)}
                className="w-full py-3 mt-4 rounded-xl font-bold text-white bg-gray-800 border border-gray-600 hover:bg-white hover:text-black transition-all duration-300"
              >
                PLAY GAME 🚀
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FullStackMissions;