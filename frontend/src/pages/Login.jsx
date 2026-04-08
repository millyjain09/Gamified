import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Gamepad2, Zap } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Temporary functions to handle navigation (we will connect backend later)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard on submit
    navigate('/dashboard');
  };

  const handleGuestPlay = () => {
    // Navigate to dashboard as a guest
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase">
            DevQuest
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono">Enter the terminal</p>
        </div>

        {/* Toggle Login / Signup */}
        <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${isLogin ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-slate-400 hover:text-white'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${!isLogin ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-slate-400 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
              <input type="text" placeholder="Username" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
            <input type="email" placeholder="Email Address" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
            <input type="password" placeholder="Password" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black italic uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" /> {isLogin ? 'Initialize' : 'Register'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#111827] text-slate-400 font-mono">OR</span></div>
        </div>

        {/* Play as Guest Option */}
        <button onClick={handleGuestPlay} className="w-full py-3 bg-slate-800 border border-slate-700 text-cyan-400 font-bold uppercase tracking-widest rounded-lg hover:bg-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 group">
          <Gamepad2 className="w-5 h-5 group-hover:animate-pulse" /> Play As Guest
        </button>

      </div>
    </div>
  );
};

export default Login;