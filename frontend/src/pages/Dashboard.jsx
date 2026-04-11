import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Coins, Play, Trophy, Cpu, Award, 
  ShieldCheck, Star, ChevronDown, CheckCircle2, Zap, X, BarChart3, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- Added axios

const PerfectedGamifiedDashboard = () => {
  const navigate = useNavigate();
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);

  // BACKEND INTEGRATION: LocalStorage se real-time data fetch kar raha hai
  const [user, setUser] = useState(() => {
    const savedData = localStorage.getItem('user');
    const parsedUser = savedData ? JSON.parse(savedData) : null;

    return {
      id: parsedUser?.id || null, // <-- Added ID so backend knows who to update
      name: parsedUser?.name || "GUEST_PLAYER",
      coins: parsedUser?.coins || 0,
      max_xp: parsedUser?.max_xp || 5000,
      rank: parsedUser?.rank || 9999,
      level: parsedUser?.level || 1,
      activeAvatarId: parsedUser?.activeAvatarId || 1,
      unlockedAvatars: parsedUser?.unlockedAvatars || [1],
      earnedBadges: parsedUser?.earnedBadges || [],
      realms: parsedUser?.realms || [
        { id: 'dsa', name: 'DSA Dojo', progress: 0, color: 'text-cyan-400' },
        { id: 'fs', name: 'Fullstack Fortress', progress: 0, color: 'text-purple-400' },
      ]
    };
  });

  // BACKEND INTEGRATION: Security check (Token nahi toh login pe bhej do)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const guest = localStorage.getItem('guestMode');
    
    if (!token && !guest) {
      navigate('/');
    }
  }, [navigate]);

  // 6 Gaming-Style Avatars
  const avatars = [
    { id: 1, name: "Neon Recon", cost: 0, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=NeonRecon&backgroundColor=b6e3f4", isLocked: false },
    { id: 2, name: "Byte Op", cost: 800, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=ByteOp&backgroundColor=ffdfbf", isLocked: true },
    { id: 3, name: "Kernel Cmdr", cost: 1500, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kernel&backgroundColor=c0aede", isLocked: true },
    { id: 4, name: "Binary Warlord", cost: 5000, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Warlord&backgroundColor=ffb8b8", isLocked: true },
    { id: 5, name: "Cyber Ghost", cost: 10000, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ghost&backgroundColor=b6e3a0", isLocked: true },
    { id: 6, name: "Phantom Striker", cost: 25000, img: "https://api.dicebear.com/7.x/adventurer/svg?seed=Phantom&backgroundColor=000000", isLocked: true },
  ];

  const badgeLibrary = [
    { id: 1, name: "Fast Learner", desc: "Complete 5 problems in 24h", icon: <Zap size={18}/> },
    { id: 2, name: "Algorithm Architect", desc: "Master all Array missions", icon: <ShieldCheck size={18}/> },
    { id: 3, name: "Fullstack Fortress", desc: "Deploy your first MERN project", icon: <BarChart3 size={18}/> },
  ];

  // <-- UPDATED: Now Async and syncs with DB & LocalStorage -->
  const handleUnlockOrSelect = async (avatarId) => {
    const avatar = avatars.find(av => av.id === avatarId);
    
    let newCoins = user.coins;
    let newUnlockedAvatars = [...user.unlockedAvatars];
    let newActiveAvatar = avatarId;

    if (user.unlockedAvatars.includes(avatarId)) {
      newActiveAvatar = avatarId;
    } else if (user.coins >= avatar.cost) {
      if (window.confirm(`Deploy ${avatar.name} for ${avatar.cost} XP?`)) {
        newCoins = user.coins - avatar.cost;
        newUnlockedAvatars.push(avatarId);
      } else {
        return; // User cancelled
      }
    } else {
      alert(`INSUFFICIENT FUNDS: Need ${avatar.cost - user.coins} more XP!`);
      return;
    }

    const updatedUserData = {
      ...user,
      coins: newCoins,
      unlockedAvatars: newUnlockedAvatars,
      activeAvatarId: newActiveAvatar
    };

    try {
      // 1. Sync with Database
      if (user.id) {
        await axios.post('http://localhost:5000/api/auth/update-stats', {
          userId: user.id,
          coins: newCoins,
          activeAvatarId: newActiveAvatar,
          unlockedAvatars: newUnlockedAvatars
        });
      }

      // 2. Update React State
      setUser(updatedUserData);

      // 3. Update LocalStorage so refresh doesn't break
      localStorage.setItem('user', JSON.stringify(updatedUserData));

    } catch (err) {
      console.error("Failed to save progress", err);
      alert("Error syncing with server! Check your connection.");
    }
  };

  const currentAvatarImg = avatars.find(av => av.id === user.activeAvatarId).img;

  return (
    <div className="min-h-screen bg-[#020205] text-white font-mono selection:bg-cyan-500 overflow-x-hidden">
      
      {/* Immersive Sci-Fi Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-transparent to-[#020205] pointer-events-none"></div>

      {/* --- HUD NAVBAR (Fully Responsive) --- */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 p-3 px-4 md:px-8 flex justify-between items-center"
      >
        {/* Left Section: Logo (Clickable to /) */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
        >
          <div className="p-1.5 md:p-2 bg-cyan-500 rounded shadow-[0_0_10px_#22d3ee] group-hover:scale-110 transition-transform">
            <Cpu className="text-black w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className="text-lg md:text-xl font-black tracking-widest text-white italic uppercase group-hover:text-cyan-400 transition-colors">
            Dev<span className="hidden sm:inline">_Quest</span>
          </span>
        </div>

        {/* Right Section: Rank, Balance, Badges, Profile */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Global Rank (Hidden on very small screens) */}
          <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4 md:pr-6">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global Rank</span>
            <span className="text-white font-black text-xs italic flex items-center gap-1">
              <Trophy size={12} className="text-yellow-500" /> #{user.rank}
            </span>
          </div>

          {/* Badges Button */}
          <button 
            onClick={() => setIsBadgeOpen(!isBadgeOpen)}
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg border transition-all ${
              isBadgeOpen ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-white/5 border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400'
            }`}
          >
            <Award size={16} />
            <span className="text-[10px] md:text-xs font-black uppercase italic tracking-tighter hidden sm:inline">Badges</span>
          </button>

          {/* Balance */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 md:px-4 py-1.5 rounded-lg shadow-inner">
            <Coins className="text-yellow-400 animate-pulse w-4 h-4 md:w-5 md:h-5" />
            <div className="leading-none text-left">
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter hidden md:block">Balance</p>
              <p className="text-yellow-400 font-black text-xs md:text-lg">{user.coins}</p>
            </div>
          </div>

          {/* Profile Circle (Real-time update) */}
          <div className="relative cursor-pointer group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-950 rounded-full overflow-hidden border-2 border-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform p-0.5">
               <img src={currentAvatarImg} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-black font-black text-[8px] md:text-[9px] w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border border-black">
              {user.level}
            </div>
          </div>

        </div>
      </motion.nav>

      {/* --- SIDE BADGE PANEL --- */}
      <AnimatePresence>
        {isBadgeOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBadgeOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            
            <motion.div 
              initial={{ x: -400, opacity: 0 }} animate={{ x: 20, opacity: 1 }} exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="fixed top-24 left-0 z-[120] w-[300px] md:w-[340px] bg-[#0a0a10] border-2 border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="p-4 md:p-5 border-b border-white/10 flex justify-between items-center bg-cyan-950/30">
                <h3 className="text-xs md:text-sm font-black uppercase italic tracking-widest text-cyan-400 flex items-center gap-2"><Trophy size={14}/> Achievement File</h3>
                <X size={18} className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setIsBadgeOpen(false)} />
              </div>

              <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {badgeLibrary.map((badge) => {
                  const isEarned = user.earnedBadges.includes(badge.id);
                  return (
                    <motion.div whileHover={{ scale: 1.02, x: 5 }} key={badge.id} className={`p-3 md:p-4 rounded-xl border flex gap-3 transition-all ${isEarned ? 'bg-cyan-950/20 border-cyan-500/20 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]' : 'bg-black opacity-30 border-white/5'}`}>
                      <div className={`mt-1 ${isEarned ? 'text-cyan-400' : 'text-slate-700'}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-tight ${isEarned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</p>
                        <p className="text-[9px] md:text-[10px] text-slate-500 leading-tight mt-1">{badge.desc}</p>
                        {isEarned && <CheckCircle2 size={12} className="text-green-500 mt-1"/>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION (Animated Real-Time Feel) --- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
        
        {/* Dynamic Glowing Background Behind Avatar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-cyan-600/20 blur-[100px] rounded-full animate-pulse"></div>

        {/* Floating Active Avatar (Real-Time game feel) */}
        <motion.div
          key={user.activeAvatarId}
          animate={{ y: [0, -25, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-48 h-48 md:w-72 md:h-72 mb-8"
        >
          <img 
            src={currentAvatarImg} 
            className="w-full h-full relative z-10 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)] object-contain" 
            alt="Active Fighter" 
          />
        </motion.div>

        {/* Hero Text & CTA */}
        <div className="relative z-10 text-center px-4 w-full">
            <span className="bg-red-600/90 text-white border border-red-400 text-[9px] md:text-[11px] font-black px-3 py-1 md:py-1.5 rounded uppercase tracking-[4px] animate-pulse">
              System Breach Detected - {user.name}
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase leading-[0.9] mt-6 tracking-tighter text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">React</span><br />Uprising
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-4 md:mt-6 max-w-xl mx-auto font-medium px-4">
              Capture the Virtual DOM and neutralize state leaks. Your first gauntlet mission is ready.
            </p>
            
            {/* Start Mission Button -> Navigates to /missions */}
            <motion.button
              whileHover={{ scale: 1.05, y: -5, boxShadow: '0 0 40px 10px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/missions')}
              className="mt-8 md:mt-12 mx-auto group relative bg-white text-black px-8 md:px-16 py-4 md:py-5 font-black uppercase italic text-lg md:text-2xl flex items-center justify-center gap-3 md:gap-5 transition-all transform -skew-x-12 hover:bg-cyan-400"
            >
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out"></div>
              <Play fill="black" className="w-5 h-5 md:w-7 md:h-7 relative z-10" /> 
              <span className="relative z-10">Start Mission</span>
            </motion.button>
        </div>
      </header>

      {/* --- AVATAR ARMORY (6 Avatars, Fully Responsive Grid) --- */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 md:mb-16 text-center sm:text-left">
          <Star className="text-cyan-400 fill-cyan-400 hidden sm:block" size={28} />
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Operator <span className="text-cyan-400">Armory</span>
          </h2>
          <div className="h-[2px] w-full sm:flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent mt-2 sm:mt-0"></div>
        </div>

        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
          {avatars.map((av) => {
            const isUnlocked = user.unlockedAvatars.includes(av.id);
            const isActive = user.activeAvatarId === av.id;

            return (
              <motion.div
                key={av.id}
                whileHover={!isActive ? { y: -10 } : {}}
                className={`relative group p-4 md:p-6 border-2 transition-all overflow-hidden rounded-2xl flex flex-col ${
                  isActive ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-white/10 bg-white/5 hover:border-cyan-500/50'
                }`}
              >
                <div className={`relative z-10 flex-grow transition-opacity ${!isUnlocked ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}>
                  <div className="w-full aspect-square bg-slate-900 rounded-xl mb-4 md:mb-6 flex items-center justify-center p-2">
                     <img src={av.img} alt={av.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-base md:text-lg font-black uppercase italic text-white tracking-tight">{av.name}</h3>
                  
                  <div className="mt-2 md:mt-4 flex items-center justify-between">
                    {isUnlocked ? (
                      <span className="text-[10px] md:text-[11px] font-bold text-cyan-400 tracking-tighter uppercase flex items-center gap-1.5"> 
                        <CheckCircle2 size={12}/> {isActive ? 'ACTIVE' : 'READY'}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-yellow-500 font-black text-sm md:text-base">
                        <Coins size={14} /> {av.cost}
                      </div>
                    )}
                    {!isUnlocked && <Lock size={14} className="text-slate-600" />}
                  </div>
                </div>

                {/* Interaction Overlay */}
                {!isActive && (
                   <div onClick={() => handleUnlockOrSelect(av.id)} className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center cursor-pointer z-20">
                      {!isUnlocked && <Lock className="text-yellow-500 mb-2 md:mb-4 w-6 h-6 md:w-8 md:h-8" />}
                      <p className={`text-xs md:text-sm font-black uppercase italic ${!isUnlocked ? 'text-yellow-500' : 'text-cyan-400'}`}>
                         {isUnlocked ? `Equip ${av.name}` : `Unlock for ${av.cost}`}
                      </p>
                      {!isUnlocked && <p className="text-[8px] md:text-[10px] text-slate-400 mt-2 border border-slate-600 px-2 py-1 rounded">Click to Purchase</p>}
                   </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- EXTENDED EXPERTISE: REALM PROGRESSION --- */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20 relative z-10 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           {user.realms.map(realm => (
              <motion.div whileHover={{ scale: 1.02 }} key={realm.id} className="p-6 md:p-8 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 relative overflow-hidden group cursor-pointer">
                 <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
                     <motion.div 
                        initial={{ width: 0 }} whileInView={{ width: `${realm.progress}%` }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee]"
                     />
                 </div>
                 <div className="flex justify-between items-start">
                     <div>
                         <p className={`text-xl md:text-2xl font-black uppercase italic ${realm.color}`}>{realm.name}</p>
                         <p className="text-[10px] md:text-xs text-slate-400 mt-1">Active Gauntlet Module</p>
                     </div>
                     <div className="text-right">
                        <p className="text-3xl md:text-4xl font-black text-white">{realm.progress}<span className="text-sm md:text-lg text-slate-600">%</span></p>
                     </div>
                 </div>
                 <button className="mt-6 md:mt-8 text-cyan-400 text-[10px] md:text-xs font-black uppercase flex items-center gap-2 group-hover:gap-4 transition-all border border-cyan-500/30 px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black">
                   Resume Training <ChevronRight size={14} />
                 </button>
              </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default PerfectedGamifiedDashboard;