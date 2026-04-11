import React, { useState } from 'react';
// Assuming you are using lucide-react for icons: npm install lucide-react
import { Lock, Coins, User, Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Mock User Data
  const navigate = useNavigate();
  const [user, setUser] = useState({
    isLoggedIn: true, // Set to true to see the logged-in view
    points: 450,
    activeAvatarId: 1
  });

  // Mock Avatar Database
  const avatars = [
    { id: 1, name: "Rookie Coder", image: "https://api.dicebear.com/7.x/bottts/svg?seed=rookie", isLocked: false, cost: 0 },
    { id: 2, name: "Neon Hacker", image: "https://api.dicebear.com/7.x/bottts/svg?seed=neon", isLocked: true, cost: 500 },
    { id: 3, name: "Cyber Ninja", image: "https://api.dicebear.com/7.x/bottts/svg?seed=ninja", isLocked: true, cost: 1200 },
    { id: 4, name: "Quantum Dev", image: "https://api.dicebear.com/7.x/bottts/svg?seed=quantum", isLocked: true, cost: 2500 },
  ];

  return (
    // Main Container: Dark theme matching your reference image
    <div className="min-h-screen bg-[#0a0f16] text-white font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Navbar / Top HUD */}
      <nav className="flex justify-between items-center p-6 border-b border-cyan-900/50 bg-[#0a0f16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="text-cyan-400 font-black text-2xl tracking-widest italic">
            DEV<span className="text-white">QUEST</span>
          </div>
        </div>
        
        {/* User Stats & Default Avatar Display */}
        {user.isLoggedIn ? (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-cyan-800/50">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-yellow-400">{user.points} XP</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-cyan-300">Level 1</div>
                <div className="text-xs text-slate-400">Novice</div>
              </div>
              {/* Active Default Avatar */}
              <div className="w-12 h-12 rounded-full bg-cyan-950 border-2 border-cyan-400 overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                <img src={avatars[0].image} alt="Default Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ) : (
          <button className="text-cyan-400 hover:text-cyan-300 font-bold tracking-wider">LOGIN</button>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center py-32 px-4 text-center overflow-hidden">
        {/* Background ambient glow matching the reference image's lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 z-10">
          The Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Generation</span>
        </h1>
        <p className="text-slate-400 max-w-xl mb-10 z-10 tracking-wide text-sm md:text-base">
          Master Data Structures, Algorithms, and Full-Stack Development. Level up your skills, earn rewards, and conquer the leaderboard.
        </p>

        {/* START A MISSION BUTTON - onClick added here! */}
        <button 
          onClick={() => navigate('/missions')} 
          className="z-10 group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl italic uppercase tracking-widest rounded-sm overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] border border-cyan-300/50"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          <span className="relative flex items-center gap-2">
            <Play className="w-6 h-6 fill-current" /> Start A Mission
          </span>
        </button>
      </main>

      {/* Avatar Armory / Store Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[2px] w-12 bg-cyan-500 rounded"></div>
          <h2 className="text-3xl font-black italic uppercase tracking-widest text-white">Choose Your <span className="text-cyan-400">Fighter</span></h2>
          <div className="h-[2px] w-12 bg-cyan-500 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="relative group bg-[#111827] rounded-lg border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-colors">
              {/* Avatar Image Background */}
              <div className={`h-48 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-6 ${avatar.isLocked ? 'opacity-40 grayscale' : ''}`}>
                 <img src={avatar.image} alt={avatar.name} className="w-full h-full object-contain drop-shadow-2xl" />
              </div>
              
              {/* Avatar Info */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <h3 className="font-bold text-lg text-slate-200">{avatar.name}</h3>
                
                {avatar.isLocked ? (
                  <div className="flex items-center justify-between mt-2 text-slate-400">
                    <span className="flex items-center gap-1 text-sm"><Lock className="w-4 h-4" /> Locked</span>
                    <span className="flex items-center gap-1 font-bold text-yellow-500"><Coins className="w-4 h-4" /> {avatar.cost}</span>
                  </div>
                ) : (
                  <div className="mt-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">Unlocked</div>
                )}
              </div>

              {/* Hover Overlay for Locked Avatars */}
              {avatar.isLocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="w-10 h-10 text-cyan-400 mb-2" />
                  <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold rounded text-sm hover:bg-cyan-500 hover:text-black transition-colors">
                    Unlock for {avatar.cost} XP
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;