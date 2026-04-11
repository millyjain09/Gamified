import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Install: npm install framer-motion

const LEVELS = [
  { title: "Initialize Repo", task: "Setup a new local repository", hint: "git init", answer: "git init" },
  { title: "First Commit", task: "Save your changes to history", hint: "git commit", answer: "git commit" },
  { title: "Create Branch", task: "Start a new experimental line", hint: "git branch feature", answer: "git branch" },
  { title: "Switch Branch", task: "Move into your new branch", hint: "git checkout feature", answer: "git checkout" },
  { title: "Merge", task: "Join feature back to main", hint: "git merge feature", answer: "git merge" },
];

export default function GitQuest() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([{ type: 'system', text: 'Welcome to GitQuest v1.0.4...' }]);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [shake, setShake] = useState(false);

  const current = LEVELS[level];

  const run = () => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [...h, { type: 'user', text: `$ ${cmd}` }]);

    if (cmd.includes(current.answer)) {
      setMsg({ text: "✨ DATA SYNCHRONIZED", type: "success" });
      setTimeout(() => {
        setLevel((l) => l + 1);
        setMsg({ text: "", type: "" });
        setHistory((h) => [...h, { type: 'system', text: `Level ${level + 2} Unlocked...` }]);
      }, 1000);
    } else {
      setMsg({ text: "⚠️ ACCESS DENIED: INVALID SYNTAX", type: "error" });
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    setInput("");
  };

  if (level >= LEVELS.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-10 bg-green-500/10 border border-green-500 rounded-3xl text-center backdrop-blur-xl">
          <h1 className="text-6xl mb-4">🏆</h1>
          <h2 className="text-4xl font-black text-green-400 mb-6 tracking-tighter">GIT MASTER</h2>
          <button onClick={() => navigate("/full-stack")} className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            RETURN TO BASE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-slate-300 p-4 md:p-10 font-sans selection:bg-cyan-500/30">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* TOP NAV */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 relative">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2">
            <span className="bg-cyan-500 text-black px-2 py-0.5 rounded">GIT</span> QUEST
          </h1>
          <div className="h-1 w-48 bg-gray-800 mt-2 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(level / LEVELS.length) * 100}%` }}
               className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
             />
          </div>
        </div>
        <button onClick={() => navigate("/full-stack")} className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors">
          [ Exit_Session ]
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6 relative">
        
        {/* REPOSITORY VISUALIZER */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111] border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] mb-6">Visualizer</h3>
            <div className="space-y-4 font-mono">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">main</span>
                <div className="flex gap-2">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-3 h-3 rounded-full bg-cyan-900" />
                  <div className="w-3 h-3 rounded-full bg-cyan-900" />
                </div>
              </div>
              <AnimatePresence>
                {level > 2 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="pl-10 border-l-2 border-dashed border-gray-800 ml-8 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-500 text-xs">feature</span>
                      <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            key={level}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] rounded-3xl shadow-2xl shadow-cyan-500/10"
          >
            <div className="bg-[#0f0f0f] p-6 rounded-[23px]">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Current Objective</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-2 tracking-tight">{current.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{current.task}</p>
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                <code className="text-xs text-cyan-300/50 italic">Hint: {current.hint}</code>
              </div>
            </div>
          </motion.div>
        </div>

        {/* TERMINAL CORE */}
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* TERMINAL HEADER */}
          <div className="bg-white/5 p-4 border-bottom border-white/5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            <span className="text-[10px] text-gray-500 font-mono ml-4 uppercase tracking-widest">bash — 80x24</span>
          </div>

          {/* HISTORY */}
          <div className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 min-h-[300px]">
            {history.map((h, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={i} 
                className={`${h.type === 'system' ? 'text-cyan-500/70 italic' : 'text-slate-300'}`}
              >
                {h.text}
              </motion.div>
            ))}
            <AnimatePresence>
              {msg.text && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-3 rounded-lg border font-bold text-center ${
                    msg.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                  }`}
                >
                  {msg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* INPUT AREA */}
          <div className="p-6 bg-white/5 border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">❯</span>
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder="Enter git command..."
                className="flex-1 bg-transparent outline-none text-white font-mono placeholder:text-gray-700"
              />
              <button 
                onClick={run}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-white text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Execute
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="max-w-6xl mx-auto mt-8 text-[10px] text-gray-600 font-mono text-center uppercase tracking-[0.3em]">
        Neural-Link Established // System.Status: Active
      </footer>
    </div>
  );
}