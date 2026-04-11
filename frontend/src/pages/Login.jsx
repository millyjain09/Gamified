import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Gamepad2, Zap } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); 
  
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };

      const response = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setMessage({ type: 'success', text: 'Registration successful! Please login.' });
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Something went wrong!' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    localStorage.setItem('guestMode', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0f16] flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="absolute w-[500px] h-[500px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-[#111827]/80 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase">
            DevQuest
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono">Enter the terminal</p>
        </div>

        <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
          <button 
            onClick={() => { setIsLogin(true); setMessage({type:'', text:''}); }}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${isLogin ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-slate-400 hover:text-white'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setMessage({type:'', text:''}); }}
            className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${!isLogin ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'text-slate-400 hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm text-center border ${message.type === 'error' ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-green-900/20 text-green-400 border-green-900/50'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" required />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black italic uppercase tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <Zap className="w-5 h-5" /> {loading ? 'Processing...' : (isLogin ? 'Initialize' : 'Register')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-[#111827] text-slate-400 font-mono">OR</span></div>
        </div>

        <button onClick={handleGuestPlay} className="w-full py-3 bg-slate-800 border border-slate-700 text-cyan-400 font-bold uppercase tracking-widest rounded-lg hover:bg-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 group">
          <Gamepad2 className="w-5 h-5 group-hover:animate-pulse" /> Play As Guest
        </button>

      </div>
    </div>
  );
};

export default Login;