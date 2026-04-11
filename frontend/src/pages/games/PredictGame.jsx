import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Scissors, Zap, Shield, ArrowLeft, Skull, CheckCircle2 } from 'lucide-react';

const PredictGame = () => {
  const navigate = useNavigate();

  // --- GAME STATE ---
  const [hp, setHp] = useState(100);
  const [xp, setXp] = useState(0);
  const [temperature, setTemperature] = useState(30);
  const [qIndex, setQIndex] = useState(1);
  const [status, setStatus] = useState('playing'); 
  const [lastAction, setLastAction] = useState(null); 

  // --- EXPANDED QUESTIONS ---
  const questions = [
    {
      id: 1,
      concept: "Post/Pre Increment",
      code: `int a = 5, b = 2;\nint c = a++ + ++b;\ncout << c << " " << a << " " << b;`,
      options: [
        { id: 'A', text: '7 6 3', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: '8 6 3', color: 'bg-blue-500/20 border-blue-500', isCorrect: true },
        { id: 'C', text: '8 5 3', color: 'bg-green-500/20 border-green-500', isCorrect: false },
        { id: 'D', text: '7 5 2', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 2,
      concept: "Nested Loops Break",
      code: `int count = 0;\nfor(int i=0; i<3; i++) {\n  for(int j=0; j<3; j++) {\n    if(j == 1) break;\n    count++;\n  }\n}\ncout << count;`,
      options: [
        { id: 'A', text: '9', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: '6', color: 'bg-blue-500/20 border-blue-500', isCorrect: false },
        { id: 'C', text: '3', color: 'bg-green-500/20 border-green-500', isCorrect: true },
        { id: 'D', text: '0', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 3,
      concept: "Pointer Arithmetic",
      code: `int arr[] = {10, 20, 30, 40};\nint *p = arr;\n*(p+2) += 5;\ncout << arr[2];`,
      options: [
        { id: 'A', text: '30', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: '35', color: 'bg-blue-500/20 border-blue-500', isCorrect: true },
        { id: 'C', text: '25', color: 'bg-green-500/20 border-green-500', isCorrect: false },
        { id: 'D', text: 'Error', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 4,
      concept: "Maximum Subarray",
      code: `// Which algorithm is the most optimal for\n// finding the maximum sum contiguous subarray?`,
      options: [
        { id: 'A', text: "Dijkstra's", color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: "Kruskal's", color: 'bg-blue-500/20 border-blue-500', isCorrect: false },
        { id: 'C', text: "Kadane's", color: 'bg-green-500/20 border-green-500', isCorrect: true },
        { id: 'D', text: "Floyd", color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 5,
      concept: "DP Time Complexity",
      code: `// What is the time complexity to find the\n// Longest Common Subsequence (LCS) of two\n// strings of lengths M and N using DP?`,
      options: [
        { id: 'A', text: 'O(M + N)', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: 'O(M * N)', color: 'bg-blue-500/20 border-blue-500', isCorrect: true },
        { id: 'C', text: 'O(2^(M+N))', color: 'bg-green-500/20 border-green-500', isCorrect: false },
        { id: 'D', text: 'O(M log N)', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 6,
      concept: "Graph Traversal",
      code: `// Which data structure is primarily used to\n// implement Breadth-First Search (BFS)?`,
      options: [
        { id: 'A', text: 'Stack', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: 'Queue', color: 'bg-blue-500/20 border-blue-500', isCorrect: true },
        { id: 'C', text: 'Priority Q', color: 'bg-green-500/20 border-green-500', isCorrect: false },
        { id: 'D', text: 'Linked List', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 7,
      concept: "BST Properties",
      code: `// In a Binary Search Tree (BST), which traversal\n// method visits the nodes in sorted (ascending) order?`,
      options: [
        { id: 'A', text: 'Preorder', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: 'Inorder', color: 'bg-blue-500/20 border-blue-500', isCorrect: true },
        { id: 'C', text: 'Postorder', color: 'bg-green-500/20 border-green-500', is: false },
        { id: 'D', text: 'Level-order', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    },
    {
      id: 8,
      concept: "Sorting Algorithms",
      code: `// What is the worst-case time complexity\n// of QuickSort?`,
      options: [
        { id: 'A', text: 'O(N log N)', color: 'bg-red-500/20 border-red-500', isCorrect: false },
        { id: 'B', text: 'O(N)', color: 'bg-blue-500/20 border-blue-500', isCorrect: false },
        { id: 'C', text: 'O(N^2)', color: 'bg-green-500/20 border-green-500', isCorrect: true },
        { id: 'D', text: 'O(log N)', color: 'bg-yellow-500/20 border-yellow-500', isCorrect: false }
      ]
    }
  ];

  const currentQ = questions[qIndex - 1];

  // --- CORE TEMPERATURE (TIMER) LOGIC ---
  useEffect(() => {
    if (status !== 'playing') return;
    
    const heatTimer = setInterval(() => {
      setTemperature((prev) => {
        if (prev >= 98) {
          clearInterval(heatTimer);
          handleMeltdown();
          return 100;
        }
        return prev + 2;
      });
    }, 1000);
    
    return () => clearInterval(heatTimer);
  }, [status, qIndex]);

  const handleMeltdown = () => {
    setHp((prev) => Math.max(0, prev - 30));
    setStatus('feedback');
    setLastAction('error');
    
    setTimeout(() => {
      if (hp - 30 <= 0) {
        setStatus('gameover');
      } else {
        moveToNextQuestion();
      }
    }, 2000);
  };

  // --- WIRE CUT (ANSWER) LOGIC ---
  const handleCutWire = (isCorrect) => {
    if (status !== 'playing') return;
    
    setStatus('feedback');

    if (isCorrect) {
      setLastAction('success');
      setXp(prev => prev + 50);
      setTemperature(prev => Math.max(30, prev - 20));
      
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    } else {
      setLastAction('error');
      setHp(prev => Math.max(0, prev - 15));
      setTemperature(prev => Math.min(100, prev + 25));
      
      setTimeout(() => {
        if (hp - 15 <= 0 || temperature + 25 >= 100) {
          setStatus('gameover');
        } else {
          moveToNextQuestion();
        }
      }, 2000);
    }
  };

  const moveToNextQuestion = () => {
    if (qIndex < questions.length) {
      setQIndex(prev => prev + 1);
      setStatus('playing');
      setLastAction(null);
    } else {
      setStatus('completed');
    }
  };

  // --- RENDER SCREENS ---
  if (status === 'gameover') {
    return (
      <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center text-center p-6">
        <Flame className="w-32 h-32 text-orange-500 mb-6 animate-bounce" />
        <h1 className="text-6xl font-black italic uppercase text-white mb-4">Core Meltdown</h1>
        <p className="text-red-300 font-mono text-xl mb-8">System destroyed. You cut the wrong wire or ran out of time.</p>
        <button onClick={() => navigate('/dsa-missions')} className="px-8 py-3 bg-red-800 border border-red-400 text-white font-bold uppercase tracking-wider rounded hover:bg-red-700 transition-colors">Evacuate</button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-[#0a0f16] flex flex-col items-center justify-center text-center p-6">
        <CheckCircle2 className="w-24 h-24 text-cyan-500 mb-6" />
        <h1 className="text-5xl font-black italic uppercase text-cyan-400 mb-4">Systems Stabilized</h1>
        <p className="text-slate-400 font-mono mb-8">You successfully dry-ran the sequences. Total XP Earned: {xp}</p>
        <button onClick={() => navigate('/dsa-missions')} className="px-8 py-3 bg-cyan-900/50 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-wider rounded hover:bg-cyan-900 transition-colors">Claim XP & Exit</button>
      </div>
    );
  }

  const bgClass = status === 'feedback' 
    ? (lastAction === 'success' ? 'bg-green-950/80' : 'bg-red-950/80') 
    : 'bg-[#0a0f16]';

  return (
    <div className={`min-h-screen ${bgClass} text-white p-6 font-sans flex flex-col transition-colors duration-300`}>
      
      {/* HUD Header */}
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center mb-8">
        <button onClick={() => navigate('/dsa-missions')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" /> Abort
        </button>
        
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="font-bold font-mono text-xl text-yellow-400">{xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className={`w-6 h-6 ${hp > 50 ? 'text-green-500' : 'text-red-500'}`} />
            <span className="font-bold font-mono text-xl">{hp} HP</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center">
        
        {/* Core Temperature Bar */}
        <div className="w-full max-w-2xl mb-12">
          <div className="flex justify-between items-end mb-2">
            <span className="text-red-500 font-black uppercase tracking-widest text-lg flex items-center gap-2">
              <Flame className="w-5 h-5" /> Core Temp
            </span>
            <span className={`font-mono text-2xl font-bold ${temperature > 80 ? 'text-red-500 animate-pulse' : temperature > 60 ? 'text-orange-500' : 'text-cyan-400'}`}>
              {temperature}°C
            </span>
          </div>
          <div className="h-6 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${temperature > 80 ? 'bg-red-600' : temperature > 60 ? 'bg-orange-500' : 'bg-cyan-500'}`}
              style={{ width: `${temperature}%` }}
            ></div>
          </div>
        </div>

        {/* The Code Screen */}
        <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-12 relative overflow-hidden">
          <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-black">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Intercepted_Sequence_{currentQ.id}.cpp</span>
            <span className="text-xs text-cyan-400 font-mono">Topic: {currentQ.concept}</span>
          </div>
          <div className="p-8">
            <pre className="text-green-400 font-mono text-lg leading-relaxed whitespace-pre-wrap">
              {currentQ.code}
            </pre>
          </div>
          
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
        </div>

        {/* The Wires (Options) */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleCutWire(opt.isCorrect)}
              disabled={status !== 'playing'}
              className={`relative group flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 transition-all duration-300 ${opt.color} hover:bg-opacity-40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="absolute top-2 left-2 text-xs font-bold text-white/50">{opt.id}</div>
              <Scissors className="w-8 h-8 text-white/70 mb-3 group-hover:text-white transition-colors" />
              <div className="font-mono text-xl font-bold text-white tracking-wider text-center">{opt.text}</div>
              <div className="mt-2 text-[10px] uppercase tracking-widest text-white/50">Cut Wire</div>
            </button>
          ))}
        </div>

        {status === 'feedback' && (
          <div className={`mt-8 text-2xl font-black italic uppercase tracking-widest animate-pulse ${lastAction === 'success' ? 'text-green-400' : 'text-red-500'}`}>
            {lastAction === 'success' ? 'TEMPERATURE DROPPING...' : 'WARNING: HEAT SPIKE! WRONG WIRE!'}
          </div>
        )}

      </div>
    </div>
  );
};

export default PredictGame;