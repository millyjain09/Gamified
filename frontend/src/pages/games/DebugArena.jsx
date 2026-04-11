import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Shield, Clock, Zap, AlertTriangle, ArrowLeft, CheckCircle2, Skull } from 'lucide-react';

// --- MOCK DATABASE (NO BACKEND NEEDED) ---
const MOCK_DATABASE = {
  1: [
    { brief: "The variable declaration is missing a terminal semicolon.", buggyCode: "let systemStatus = 'active'\nlet power = 100;", expectedFix: ";" },
    { brief: "This function should ADD two numbers, but it subtracts them.", buggyCode: "function addPower(a, b) {\n  return a - b;\n}", expectedFix: "a+b" },
    { brief: "Fix the array index to access the FIRST element.", buggyCode: "const nodes = ['Alpha', 'Beta', 'Gamma'];\nlet firstNode = nodes[1];", expectedFix: "nodes[0]" },
    { brief: "Correct the equality check. It should check if status is true.", buggyCode: "if (status = true) {\n  console.log('Online');\n}", expectedFix: "status===true" },
    { brief: "Return the correct boolean value for success.", buggyCode: "function isReady() {\n  return 'true';\n}", expectedFix: "returntrue" }
  ],
  2: [
    { brief: "The loop is causing an infinite assignment. Fix the equality condition.", buggyCode: "for(let i=0; i<5; i++) {\n  if(i = 3) break;\n}", expectedFix: "i===3" },
    { brief: "The string template literal is broken. Use backticks.", buggyCode: "const user = 'Neo';\nconst greet = 'Wake up, ${user}';", expectedFix: "`Wakeup,${user}`" },
    { brief: "Convert this string to an integer properly.", buggyCode: "let level = '2';\nlet nextLevel = parseInt(level) + 1.5;", expectedFix: "parseInt(level)+1" }
  ],
  3: [
    { brief: "Filter out only the EVEN numbers.", buggyCode: "const evens = nums.filter(n => n % 2 !== 0);", expectedFix: "n%2===0" },
    { brief: "Check if the array includes the target virus.", buggyCode: "const found = system.contains('virus');", expectedFix: "system.includes('virus')" },
    { brief: "Fix the object property access.", buggyCode: "const user = { name: 'Admin' };\nconsole.log(user[name]);", expectedFix: "user.name" }
  ],
  4: [
    { brief: "React state mutation is direct. Fix it.", buggyCode: "const [hp, setHp] = useState(100);\nhp = hp - 10;", expectedFix: "setHp(hp-10)" },
    { brief: "Fix the missing await in the async fetch.", buggyCode: "async function getData() {\n  const res = fetch('/api/data');\n}", expectedFix: "awaitfetch" }
  ],
  5: [
    { brief: "Fix the recursive Fibonacci base case to stop infinite loops.", buggyCode: "function fib(n) {\n  if (n === 0) return 1;\n  return fib(n-1) + fib(n-2);\n}", expectedFix: "if(n<=1)returnn" }
  ]
};

const DebugArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const levelId = location.state?.levelId || 1;

  // Current logged in user
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  const levelConfigs = {
    1: { title: "Level 1: Beginner", time: 60, totalQs: 5, color: "text-green-500", border: "border-green-500" },
    2: { title: "Level 2: Easy Logic", time: 90, totalQs: 5, color: "text-yellow-500", border: "border-yellow-500" },
    3: { title: "Level 3: Intermediate", time: 120, totalQs: 7, color: "text-orange-500", border: "border-orange-500" },
    4: { title: "Level 4: Advanced", time: 150, totalQs: 7, color: "text-red-500", border: "border-red-500" },
    5: { title: "Level 5: Expert Mode", time: 180, totalQs: 10, color: "text-purple-500", border: "border-purple-500" }
  };
  const config = levelConfigs[levelId];

  // --- GAME STATE ---
  const [hp, setHp] = useState(100);
  const [pw, setPw] = useState(0); 
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [qIndex, setQIndex] = useState(1);
  const [status, setStatus] = useState('loading'); 
  const [feedback, setFeedback] = useState("Initializing System...");
  
  const [currentQuestion, setCurrentQuestion] = useState({
      brief: "Loading module...",
      buggyCode: "",
      expectedFix: ""
  });
  const [userCode, setUserCode] = useState("");

  // --- FETCH QUESTION FROM LOCAL DB ---
  const fetchNextQuestion = () => {
    setStatus('loading');
    setFeedback("Extracting anomaly from local database...");
    
    // Fake a small delay for the "hacker" feel
    setTimeout(() => {
      const levelQuestions = MOCK_DATABASE[levelId] || MOCK_DATABASE[1];
      // Using modulo so if there are fewer questions than config.totalQs, it repeats safely
      const nextQ = levelQuestions[(qIndex - 1) % levelQuestions.length];
      
      setCurrentQuestion(nextQ);
      setUserCode(nextQ.buggyCode);
      setTimeLeft(config.time);
      setStatus('playing');
      setFeedback("System ready. Waiting for compilation...");
    }, 800);
  };

  useEffect(() => {
    if (qIndex <= config.totalQs) {
      fetchNextQuestion();
    }
  }, [qIndex]);

  useEffect(() => {
    if (status !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const unlockNextLevel = () => {
    const currentHighest = parseInt(localStorage.getItem('debugHighestLevel')) || 1;
    if (levelId + 1 > currentHighest && levelId < 5) {
      localStorage.setItem('debugHighestLevel', levelId + 1);
    }
  };

  // --- TIMEOUT LOGIC ---
  const handleTimeOut = () => {
    setHp((prev) => Math.max(0, prev - 20));
    setPw((prev) => Math.max(0, prev - 10)); 
    setStatus('error');
    
    if (hp - 20 <= 0) {
      setFeedback("CRITICAL ERROR: Time Limit Exceeded! System crashed.");
      setTimeout(() => setStatus('gameover'), 1500);
    } else {
      setFeedback(`CRITICAL ERROR: Time out! Correct fix was: "${currentQuestion.expectedFix}". -20 HP. Proceeding...`);
      setTimeout(() => {
        if (qIndex < config.totalQs) {
          setQIndex(prev => prev + 1);
        } else {
          unlockNextLevel(); 
          setStatus('completed');
          setFeedback(`MISSION ACCOMPLISHED! Level ${levelId} Cleared.`);
        }
      }, 3500);
    }
  };

  // --- SMART COMPILER LOGIC ---
  const handleCompile = () => {
    if (userCode.trim() === currentQuestion.buggyCode.trim()) {
      setFeedback("SYSTEM WARNING: No changes detected! Modify the code to fix the bug.");
      return; 
    }

    let isCorrect = false;
    const fix = currentQuestion.expectedFix || "";
    const cleanUserCode = userCode.replace(/\s+/g, '');
    const cleanFix = fix.replace(/\s+/g, '');

    if (cleanFix === ';') {
      const oldSemicolons = (currentQuestion.buggyCode.match(/;/g) || []).length;
      const newSemicolons = (userCode.match(/;/g) || []).length;
      if (newSemicolons > oldSemicolons) {
        isCorrect = true;
      }
    } else {
      if (cleanUserCode.includes(cleanFix)) {
          isCorrect = true;
      }
    }

    if (isCorrect) {
      setPw(prev => prev + 50); 
      
      // 🚀 COIN LOGIC: Level * 10 
      const coinsEarned = levelId * 10;
      
      // LocalStorage & UI Update (No backend needed for the game to work, but we save coins locally)
      if (userData) {
        const newCoins = (userData.coins || 0) + coinsEarned;
        const updatedUser = { ...userData, coins: newCoins };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Taki Dashboard update ho jaye
      }
      
      setStatus('success');
      setFeedback(`SUCCESS: Bug eradicated! +50 PW & +${coinsEarned} Coins (Fix verified)`);
      
      setTimeout(() => {
        if (qIndex < config.totalQs) {
          setQIndex(prev => prev + 1);
        } else {
          unlockNextLevel();
          setStatus('completed');
          setFeedback(`MISSION ACCOMPLISHED! Level ${levelId} Cleared.`);
        }
      }, 2000);
    } else {
      setHp((prev) => Math.max(0, prev - 20));
      setPw((prev) => Math.max(0, prev - 10)); 
      setStatus('error');
      
      if (hp - 20 <= 0) {
        setFeedback(`ERROR: Fix incorrect! Correct fix was: "${currentQuestion.expectedFix}". System crashed.`);
        setTimeout(() => setStatus('gameover'), 1500);
      } else {
        setFeedback(`ERROR: Fix incorrect! Correct fix was: "${currentQuestion.expectedFix}". -20 HP, -10 PW. Proceeding...`);
        setTimeout(() => {
          if (qIndex < config.totalQs) {
            setQIndex(prev => prev + 1);
          } else {
            unlockNextLevel(); 
            setStatus('completed');
            setFeedback(`MISSION ACCOMPLISHED! Level ${levelId} Cleared.`);
          }
        }, 3500);
      }
    }
  };

  // --- RENDER SCREENS ---
  if (status === 'gameover') {
    return (
      <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center justify-center text-center p-6">
        <Skull className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-5xl font-black italic uppercase text-red-500 mb-4">System Crashed</h1>
        <p className="text-slate-400 font-mono mb-8">HP depleted. Final Power: {pw} PW</p>
        <button onClick={() => navigate('/games/debug')} className="px-8 py-3 bg-red-900/50 border border-red-500 text-red-400 font-bold uppercase tracking-wider rounded hover:bg-red-900 transition-colors">Return to Base</button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center justify-center text-center p-6">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-5xl font-black italic uppercase text-green-500 mb-4">Level Cleared</h1>
        <p className="text-slate-400 font-mono mb-8">You successfully debugged all anomalies. Total Power Earned: {pw} PW</p>
        <button onClick={() => navigate('/games/debug')} className="px-8 py-3 bg-green-900/50 border border-green-500 text-green-400 font-bold uppercase tracking-wider rounded hover:bg-green-900 transition-colors">Claim PW & Exit</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white p-6 font-sans flex flex-col">
      {/* Top HUD */}
      <div className="max-w-7xl w-full mx-auto flex flex-wrap justify-between items-center mb-6 border-b border-slate-800 pb-4 gap-4">
        <button onClick={() => navigate('/games/debug')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Abort
        </button>
        
        <div className={`font-black italic uppercase tracking-wider ${config.color} text-xl`}>
          {config.title}
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="font-bold font-mono text-xl text-yellow-400 w-16">{pw} PW</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className={`w-6 h-6 ${hp > 50 ? 'text-green-500' : hp > 20 ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="font-bold font-mono text-xl w-16">{hp}%</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1 rounded border ${timeLeft <= 10 ? 'border-red-500 bg-red-500/20 text-red-400 animate-pulse' : 'border-cyan-500/50 bg-cyan-900/20 text-cyan-400'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-bold font-mono text-xl w-12 text-center">{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left Column: Briefing & Question Number */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-8 h-8 ${config.color}`} />
              <h2 className={`text-xl font-bold uppercase tracking-wider ${config.color}`}>Anomaly Detected</h2>
            </div>
            <div className="bg-slate-800 px-4 py-1 rounded-full text-sm font-bold tracking-widest text-slate-300 font-mono">
              Q: {qIndex} / {config.totalQs}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {status === 'loading' ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-sm uppercase tracking-widest">{feedback}</p>
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                <strong className="text-white">Briefing:</strong><br/>
                {currentQuestion.brief}
              </p>
            )}
          </div>

          <div className={`mt-4 p-4 rounded-lg border min-h-[100px] flex flex-col justify-center ${
            status === 'error' ? 'bg-red-900/20 border-red-500/50 text-red-400' : 
            status === 'success' ? 'bg-green-900/20 border-green-500/50 text-green-400' : 
            'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-bold uppercase text-xs tracking-wider opacity-70">
              <Terminal className="w-4 h-4" /> Terminal Output
            </div>
            <p className="font-mono text-sm">{feedback}</p>
          </div>
        </div>

        {/* Right Column: Editor */}
        <div className="flex flex-col gap-4 h-[600px]">
          <div className={`flex-1 bg-[#1e1e1e] rounded-xl border ${status === 'playing' ? 'border-slate-700' : 'border-slate-800'} overflow-hidden relative flex flex-col`}>
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-slate-400 font-mono">corrupted_file.cpp</span>
            </div>
            
            <textarea 
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              disabled={status !== 'playing'}
              className="flex-1 w-full bg-transparent text-green-400 font-mono text-sm p-4 focus:outline-none resize-none disabled:opacity-70"
              spellCheck="false"
            />
          </div>

          <button 
            onClick={handleCompile}
            disabled={status !== 'playing'}
            className={`w-full py-4 font-black italic uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
              status === 'playing' 
                ? `bg-slate-800 text-white border ${config.border} hover:bg-slate-700 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]` 
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
            }`}
          >
            {status === 'loading' ? 'Loading Local Data...' : status === 'success' ? 'Fix Applied' : status === 'error' ? 'Analyzing...' : <><Terminal className="w-5 h-5"/> Compile & Execute</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DebugArena;