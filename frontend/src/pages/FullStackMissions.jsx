import React from 'react';
import { useNavigate } from 'react-router-dom';

const FullStackMissions = () => {
  const navigate = useNavigate();

  // Array of 5 Epic Full Stack Missions
  const missions = [
    { 
      id: "debug-dungeon", 
      title: "The Debug Dungeon", 
      type: "Code Debugging", 
      desc: "Find the hidden syntax errors and logical bugs in the MERN code before the system crashes.", 
      xp: 50, 
      color: "border-red-500 hover:shadow-red-500/50 text-red-400",
      path: "/games/debug-dungeon"
    },
    { 
      id: "guardians-gate", 
      title: "Guardian's Gate", 
      type: "JWT Security", 
      desc: "Forge the correct JWT tokens to bypass the middleware guards and secure the API routes.", 
      xp: 100, 
      color: "border-purple-500 hover:shadow-purple-500/50 text-purple-400",
      path: "/games/guardians-gate"
    },
    { 
      id: "network-maze", 
      title: "Network Maze", 
      type: "API Routing", 
      desc: "Route the lost JSON data packets correctly from the Express backend to the React frontend.", 
      xp: 80, 
      color: "border-blue-500 hover:shadow-blue-500/50 text-blue-400",
      path: "/games/network-maze"
    },
    { 
      id: "deployment-dock", 
      title: "Deployment Dock", 
      type: "DevOps", 
      desc: "Configure the build pipeline, set env variables, and push the application to the live cloud.", 
      xp: 150, 
      color: "border-green-500 hover:shadow-green-500/50 text-green-400",
      path: "/games/deployment-dock"
    },
    { 
      id: "broken-kingdom", 
      title: "Broken Kingdom", 
      type: "Form Validation", 
      desc: "User inputs are causing chaos! Restore order by fixing the broken React form validations.", 
      xp: 70, 
      color: "border-yellow-500 hover:shadow-yellow-500/50 text-yellow-400",
      path: "/games/broken-kingdom"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] p-8 md:p-12 font-sans text-gray-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4 tracking-wider uppercase drop-shadow-lg">
            Full Stack Arena
          </h1>
          <p className="text-lg text-gray-400">Select your mission. Fix the code. Earn XP.</p>
        </div>

        {/* Mission Grid */}
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
                
                <h3 className="text-2xl font-black mb-3 text-white">{mission.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {mission.desc}
                </p>
              </div>
              
              <button 
                onClick={() => navigate(mission.path)}
                className="w-full py-3 mt-4 rounded-xl font-bold text-white bg-gray-800 border border-gray-600 hover:bg-white hover:text-black transition-all duration-300"
              >
                START MISSION 🚀
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FullStackMissions;