import React, { useState, useEffect, useRef } from 'react';

const MazeRunner = () => {
  // --- Configuration ---
  const GRID_SIZE = 11;
  const DIRECTIONS = [
    { r: 0, c: 1, label: 'Right' },
    { r: 1, c: 0, label: 'Down' },
    { r: 0, c: -1, label: 'Left' },
    { r: -1, c: 0, label: 'Up' }
  ];

  // --- State Management ---
  const [maze, setMaze] = useState([]);
  const [userCode, setUserCode] = useState(initialTemplate);
  const [status, setStatus] = useState('idle'); // idle, running, success, failed
  const [logs, setLogs] = useState(["// System: Ready. Write your solve() function."]);
  const [vizIndex, setVizIndex] = useState(-1);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [speed, setSpeed] = useState(80);

  const timerRef = useRef(null);

  // --- Maze Generation (Recursive Backtracking Algorithm) ---
  const generateMaze = () => {
    let newMaze = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(1));
    const carve = (r, c) => {
      newMaze[r][c] = 0;
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => Math.random() - 0.5);
      for (let [dr, dc] of dirs) {
        let nr = r + dr * 2, nc = c + dc * 2;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && newMaze[nr][nc] === 1) {
          newMaze[r + dr][c + dc] = 0;
          carve(nr, nc);
        }
      }
    };
    carve(0, 0);
    newMaze[0][0] = 0;
    newMaze[GRID_SIZE - 1][GRID_SIZE - 1] = 0;
    setMaze(newMaze);
    resetSimulation();
  };

  useEffect(() => { generateMaze(); }, []);

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setVizIndex(-1);
    setAnimationSteps([]);
    setLogs(["// Maze Reset. Tyar ho? Click Run!"]);
  };

  // --- Code Execution Engine ---
  const runCode = () => {
    resetSimulation();
    setLogs(prev => [...prev, "🚀 Injecting logic into Rat..."]);

    try {
      // Create a sandbox function from user string
      const solveFunc = new Function('maze', 'start', 'end', 'size', `
        ${userCode}
        return solve(maze, start, end, size);
      `);

      const mazeCopy = maze.map(row => [...row]);
      const rawPath = solveFunc(mazeCopy, { r: 0, c: 0 }, { r: GRID_SIZE - 1, c: GRID_SIZE - 1 }, GRID_SIZE);

      if (!Array.isArray(rawPath)) throw new Error("solve() must return an Array of {r, c} steps!");

      processPathForVisualization(rawPath);
    } catch (err) {
      setLogs(prev => [...prev, `❌ Error: ${err.message}`, "Bhai, code check kar, syntax error ho sakta hai!"]);
    }
  };

  const processPathForVisualization = (path) => {
    let processedSteps = [];
    let visitedCells = new Set();

    path.forEach((pos) => {
      const key = `${pos.r}-${pos.c}`;
      if (maze[pos.r]?.[pos.c] === 1) {
        processedSteps.push({ ...pos, type: 'wall-hit' });
      } else if (visitedCells.has(key)) {
        processedSteps.push({ ...pos, type: 'backtrack' });
      } else {
        processedSteps.push({ ...pos, type: 'forward' });
        visitedCells.add(key);
      }
    });

    setAnimationSteps(processedSteps);
    animateRat(processedSteps);
  };

  const animateRat = (steps) => {
    setStatus('running');
    let index = 0;

    timerRef.current = setInterval(() => {
      if (index >= steps.length) {
        clearInterval(timerRef.current);
        const lastStep = steps[steps.length - 1];
        if (lastStep.r === GRID_SIZE - 1 && lastStep.c === GRID_SIZE - 1) {
          setStatus('success');
          setLogs(prev => [...prev, "🎉 SHABASH! Cheese mil gaya!"]);
        } else {
          setStatus('failed');
          setLogs(prev => [...prev, "😢 Target missing. Try again!"]);
        }
        return;
      }

      const current = steps[index];
      setVizIndex(index);

      if (current.type === 'wall-hit') {
        setLogs(prev => [...prev, `💥 BOOM! Wall hit at (${current.r}, ${current.c})`]);
        clearInterval(timerRef.current);
        setStatus('failed');
      } else if (current.type === 'backtrack') {
        if (index % 5 === 0) setLogs(prev => [...prev, `↩ Backtracking...`]);
      }

      index++;
    }, speed);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a16] text-slate-100 font-mono p-4">
      {/* Header Section */}
      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            MAZE RUNNER DSA v2.0
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Backtracking Visualizer</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500">SPEED: {speed}ms</span>
            <input type="range" min="20" max="300" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-24 accent-purple-500" />
          </div>
          <button onClick={generateMaze} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-sm">New Level</button>
          <button onClick={runCode} className="px-8 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold text-sm transition-transform active:scale-95">
            ▶ RUN CODE
          </button>
        </div>
      </header>

      <main className="flex flex-1 gap-6 overflow-hidden">
        {/* Left: Maze Board */}
        <div className="flex-[1.3] bg-slate-900/50 rounded-2xl border border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
          <div className="grid gap-1.5 p-4 bg-black/40 rounded-xl border border-white/5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {maze.map((row, r) => row.map((cell, c) => {
              const isWall = cell === 1;
              const step = animationSteps.slice(0, vizIndex + 1).findLast(s => s.r === r && s.c === c);
              const isCurrent = animationSteps[vizIndex]?.r === r && animationSteps[vizIndex]?.c === c;

              let cellStyle = isWall ? "bg-slate-800" : "bg-slate-950";
              if (step?.type === 'forward') cellStyle = "bg-cyan-500/80 shadow-[0_0_12px_rgba(34,211,238,0.4)]";
              if (step?.type === 'backtrack') cellStyle = "bg-orange-500/50";
              if (step?.type === 'wall-hit') cellStyle = "bg-red-500 animate-pulse";
              if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) cellStyle = "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]";

              return (
                <div key={`${r}-${c}`} className={`w-9 h-9 rounded-md flex items-center justify-center transition-all duration-300 ${cellStyle}`}>
                  {isCurrent ? <span className="text-xl animate-bounce">🐭</span> : 
                   (r === GRID_SIZE - 1 && c === GRID_SIZE - 1 ? "🧀" : "")}
                </div>
              );
            }))}
          </div>

          {/* Success Overlay */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
               <span className="text-6xl mb-4">🏆</span>
               <h2 className="text-4xl font-black text-white italic">MISSION ACCOMPLISHED</h2>
               <p className="text-purple-200 mt-2">Bhai logic ek dum perfect hai! Next level try karein?</p>
               <button onClick={generateMaze} className="mt-6 px-8 py-3 bg-white text-purple-900 font-bold rounded-full">NEXT LEVEL</button>
            </div>
          )}
        </div>

        {/* Right: Code Editor & Console */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 bg-[#0d0d1a] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-xl">
            <div className="bg-white/5 px-4 py-2 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 tracking-widest">EDITOR: solve(maze, start, end, size)</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="flex-1 bg-transparent p-6 outline-none resize-none text-cyan-300/90 text-[13px] leading-relaxed font-['FiraCode-Regular',monospace]"
              spellCheck="false"
            />
          </div>

          <div className="h-48 bg-black/80 rounded-2xl border border-white/10 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-tighter">Debug Console Output</p>
            {logs.map((msg, i) => (
              <div key={i} className={`text-[12px] mb-1 ${msg.includes('❌') || msg.includes('💥') ? 'text-red-400' : 'text-cyan-400/80'}`}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const initialTemplate = `function solve(maze, start, end, size) {
  const path = [];
  const visited = Array(size).fill().map(() => Array(size).fill(false));

  function backtrack(r, c) {
    // 1. Sniff Check: Bounds, Walls, or Visited?
    if (r < 0 || c < 0 || r >= size || c >= size || 
        maze[r][c] === 1 || visited[r][c]) {
      return false;
    }

    // 2. Mark current cell
    path.push({r, c});
    visited[r][c] = true;

    // 3. Cheese Found?
    if (r === end.r && c === end.c) return true;

    // 4. Explore Neighbors (R, D, L, U)
    if (backtrack(r, c + 1)) return true; // Right
    if (backtrack(r + 1, c)) return true; // Down
    if (backtrack(r, c - 1)) return true; // Left
    if (backtrack(r - 1, c)) return true; // Up

    // 5. Backtrack: If all paths fail, step back visually
    path.push({r, c}); 
    return false;
  }

  backtrack(start.r, start.c);
  return path;
}`;

export default MazeRunner;