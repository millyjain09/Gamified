import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const GRID = 11;

const AlgoYudhRatMaze = () => {
  const animTimer = useRef(null);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  
  // --- Simplified Boilerplate for the user ---
  const initialBoilerplate = `function solve(maze, start, end, size) {
  const path = [];
  const visited = Array(size).fill().map(() => Array(size).fill().map(() => [false, false]));

  function backtrack(r, c, hasKey) {
    // Basic bounds checking
    if (r < 0 || c < 0 || r >= size || c >= size || maze[r][c] === 1) return false;
    
    // --- WRITE YOUR LOGIC HERE ---
    // 1. Check if the current cell is 'FIRE'. If yes, return false immediately.
    

    // 2. Check if the current cell is 'DOOR'. If yes, and hasKey is false, return false.
    

    // 3. Update currentKey. If the cell is 'KEY', currentKey becomes true.
    let currentKey = hasKey; // UPDATE THIS
    // -----------------------------

    let kIdx = currentKey ? 1 : 0;
    if (visited[r][c][kIdx]) return false;

    // Log path
    path.push({ r, c, type: 'forward', hasKey: currentKey });
    visited[r][c][kIdx] = true;

    // Reached destination?
    if (r === end.r && c === end.c) return true;

    // Explore: Down, Right, Up, Left
    if (backtrack(r + 1, c, currentKey)) return true;
    if (backtrack(r, c + 1, currentKey)) return true;
    if (backtrack(r - 1, c, currentKey)) return true;
    if (backtrack(r, c - 1, currentKey)) return true;

    // Backtrack
    path.push({ r, c, type: 'back', hasKey: currentKey });
    return false;
  }

  backtrack(start.r, start.c, false);
  return path;
}`;

  const [code, setCode] = useState(initialBoilerplate);
  const [maze, setMaze] = useState([]);
  const [steps, setSteps] = useState([]);
  const [vizIdx, setVizIdx] = useState(-1);
  const [hasKey, setHasKey] = useState(false);
  const [status, setStatus] = useState('idle');
  const [aiMsg, setAiMsg] = useState("AI Coach: Ready? Complete the TODOs to guide the mouse!");
  const [speed, setSpeed] = useState(150);
  const [overlay, setOverlay] = useState({ show: false, icon: '', title: '', btn: '', bg: '', stats: null });
  const [optimalPathLength, setOptimalPathLength] = useState(0);

  // --- BFS to verify Solvability & Find Shortest Path ---
  const getPath = (m, start, target) => {
    let parent = {}, q = [[start[0], start[1], false]], vis = new Set([start[0] + ',' + start[1] + ',false']);
    while (q.length) {
      let [r, c, keyState] = q.shift();
      
      if (r === target[0] && c === target[1]) {
        let path = [], cur = [r, c, keyState];
        while (cur) { 
          path.push(cur); 
          cur = parent[cur[0] + ',' + cur[1] + ',' + cur[2]]; 
        }
        return path.reverse();
      }

      for (let [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        let nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= GRID || nc >= GRID || m[nr][nc] === 1 || m[nr][nc] === 'FIRE') continue;
        
        let nextKeyState = keyState || m[nr][nc] === 'KEY';
        if (m[nr][nc] === 'DOOR' && !nextKeyState) continue; // Cannot pass door without key

        let stateStr = nr + ',' + nc + ',' + nextKeyState;
        if (!vis.has(stateStr)) {
          vis.add(stateStr); 
          parent[stateStr] = [r, c, keyState]; 
          q.push([nr, nc, nextKeyState]);
        }
      }
    }
    return [];
  };

  const newLevel = () => {
    clearInterval(animTimer.current);
    setSteps([]); setVizIdx(-1); setStatus('idle'); setHasKey(false); setOverlay({ show: false });
    
    let m = [], mainRoad = [];
    
    // Ensure we ALWAYS generate a solvable maze
    while (mainRoad.length === 0) {
      m = Array(GRID).fill(1).map(() => Array(GRID).fill(1));
      const carve = (r, c) => {
        m[r][c] = 0;
        let dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]].sort(() => Math.random() - 0.5);
        for (let [dr, dc] of dirs) {
          let nr = r + dr, nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < GRID && nc < GRID && m[nr][nc] === 1) {
            m[r + dr / 2][c + dc / 2] = 0; carve(nr, nc);
          }
        }
      };
      carve(0, 0); m[GRID-1][GRID-1] = 0;

      // Base path without obstacles
      let basePath = getPath(m, [0, 0], [GRID-1, GRID-1]);
      
      if (basePath.length > 5) {
        let doorCell = basePath[Math.floor(basePath.length * 0.7)];
        let keyCell = basePath[Math.floor(basePath.length * 0.3)];
        m[doorCell[0]][doorCell[1]] = 'DOOR';
        m[keyCell[0]][keyCell[1]] = 'KEY';
      }

      let roadSet = new Set(basePath.map(p => `${p[0]},${p[1]}`));
      let fireAdded = 0;
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          if (m[r][c] === 0 && !roadSet.has(`${r},${c}`) && Math.random() > 0.6 && fireAdded < 5) {
            m[r][c] = 'FIRE'; fireAdded++;
          }
        }
      }
      
      // Verify final solvability with obstacles
      mainRoad = getPath(m, [0, 0], [GRID-1, GRID-1]);
    }

    setOptimalPathLength(mainRoad.length); 
    setMaze(m);
    setAiMsg("AI Coach: Level ready. Avoid the fire, grab the key to unlock the door!");
  };

  useEffect(() => { newLevel(); }, []);

  const runCode = (customCode = null) => {
    clearInterval(animTimer.current);
    const codeToEval = customCode || code;
    try {
      const userFn = new Function('maze', 'start', 'end', 'size', `${codeToEval}; return solve(maze, start, end, size);`);
      
      const t0 = performance.now();
      const pathSteps = userFn(maze.map(r => [...r]), { r: 0, c: 0 }, { r: GRID - 1, c: GRID - 1 }, GRID);
      const t1 = performance.now();
      const execTime = (t1 - t0).toFixed(2);

      if (!pathSteps || pathSteps.length === 0) {
        setAiMsg("AI Coach: The mouse didn't move! Did you return false too early?");
        return;
      }
      
      setSteps(pathSteps);
      animate(pathSteps, execTime);
    } catch (err) {
      setAiMsg("AI Coach: Syntax Error - " + err.message.split('\n')[0]);
    }
  };

  const handleWinScore = (userPathLength, execTimeStr) => {
    const execTime = parseFloat(execTimeStr);
    const baseScore = 100;
    const speedBonus = execTime < 2 ? 50 : execTime < 10 ? 30 : 10;
    
    // Path efficiency: How many 'forward' moves did the user's logic take compared to BFS?
    const forwardSteps = steps.filter(s => s.type === 'forward').length;
    const extraSteps = forwardSteps - optimalPathLength;
    const pathBonus = extraSteps <= 0 ? 50 : Math.max(0, 50 - (extraSteps * 2));
    
    const totalEarned = baseScore + speedBonus + pathBonus;

    if (userData && userData.id) {
      const newCoins = (userData.coins || 0) + totalEarned;
      const updatedUser = { ...userData, coins: newCoins };

      axios.post('http://localhost:5000/api/auth/update-stats', {
        userId: userData.id,
        coins: newCoins,
        activeAvatarId: userData.activeAvatarId,
        unlockedAvatars: userData.unlockedAvatars
      }).then(() => {
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); 
      }).catch(err => console.error("Coin update failed", err));
    }

    setOverlay({ 
      show: true, icon: '🧀', title: 'MISSION PASSED', btn: 'NEXT MAZE', bg: 'rgba(6,78,59,0.95)', mode: 'win',
      stats: { baseScore, speedBonus, pathBonus, totalEarned, execTime, forwardSteps }
    });
  };

  const animate = (path, execTime) => {
    setStatus('running');
    let i = 0;
    
    animTimer.current = setInterval(() => {
      if (i >= path.length) { 
        clearInterval(animTimer.current); 
        // If animation ends but didn't reach cheese
        if (status === 'running') {
            setStatus('lost');
            setOverlay({ show: true, icon: '🤔', title: 'LOST IN MAZE', btn: 'RETRY CODE', bg: 'rgba(30,41,59,0.9)' });
        }
        return; 
      }
      
      const s = path[i];
      const cell = maze[s.r][s.c];

      setVizIdx(i);
      setHasKey(s.hasKey);

      // REAL-TIME COLLISION DETECTION BASED ON USER'S EXACT PATH
      if (cell === 'FIRE') {
        setStatus('burnt'); clearInterval(animTimer.current);
        setOverlay({ show: true, icon: '💀', title: 'BURNED ALIVE!', btn: 'FIX CODE', bg: 'rgba(127,29,29,0.9)' });
      } else if (cell === 'DOOR' && !s.hasKey) {
        setStatus('locked'); clearInterval(animTimer.current);
        setOverlay({ show: true, icon: '🔒', title: 'DOOR LOCKED! NEED KEY!', btn: 'FIX CODE', bg: 'rgba(30,41,59,0.9)' });
      } else if (s.r === GRID-1 && s.c === GRID-1 && i === path.length - 1) {
        setStatus('win'); clearInterval(animTimer.current);
        handleWinScore(path.length, execTime); 
      }
      i++;
    }, speed);
  };

  const getSolution = () => {
    const sol = `function solve(maze, start, end, size) {
  const path = [];
  const visited = Array(size).fill().map(() => Array(size).fill().map(() => [false, false]));
  
  function backtrack(r, c, hasKey) {
    if (r < 0 || c < 0 || r >= size || c >= size || maze[r][c] === 1) return false;
    
    if (maze[r][c] === 'FIRE') return false;
    if (maze[r][c] === 'DOOR' && !hasKey) return false;
    
    let currentKey = hasKey || maze[r][c] === 'KEY';
    
    let kIdx = currentKey ? 1 : 0;
    if (visited[r][c][kIdx]) return false;
    
    path.push({ r, c, type: 'forward', hasKey: currentKey });
    visited[r][c][kIdx] = true;
    
    if (r === end.r && c === end.c) return true;
    
    if (backtrack(r+1, c, currentKey)) return true;
    if (backtrack(r, c+1, currentKey)) return true;
    if (backtrack(r-1, c, currentKey)) return true;
    if (backtrack(r, c-1, currentKey)) return true;
    
    path.push({ r, c, type: 'back', hasKey: currentKey });
    return false;
  }
  
  backtrack(start.r, start.c, false);
  return path;
}`;
    setCode(sol);
    setTimeout(() => runCode(sol), 100);
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.title}>ALGOYUDH: MISSION RAT_MAZE</div>
        <div style={s.btnRow}>
          <div style={s.coinDisplay}>🪙 {userData?.coins || 0}</div>
          <button style={s.btnReset} onClick={newLevel}>NEW MAZE</button>
          <button style={s.btnSol} onClick={getSolution}>GET SOLUTION</button>
          <button style={s.btnRun} onClick={() => runCode()}>DEPLOY CODE</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.editorPanel}>
           <div style={s.bar}>CODE_EDITOR.js</div>
           <textarea style={s.textarea} value={code} onChange={e => setCode(e.target.value)} spellCheck="false" />
           <div style={s.speedBar}>SPEED: {speed}ms <input type="range" min="20" max="500" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></div>
        </div>

        <div style={s.gamePanel}>
          <div style={s.aiBar}>{aiMsg}</div>
          <div style={{...s.gridWrap, gridTemplateColumns: `repeat(${GRID}, 30px)`}}>
            {maze.map((row, r) => row.map((val, c) => {
              const step = steps.slice(0, vizIdx + 1).find(st => st.r === r && st.c === c);
              const isCur = steps[vizIdx]?.r === r && steps[vizIdx]?.c === c;
              
              let bg = '#0f172a';
              if (val === 1) bg = '#1e293b';
              else if (val === 'FIRE') bg = '#450a0a';
              else if (val === 'DOOR') bg = hasKey ? '#064e3b' : '#451a03';
              else if (step?.type === 'forward') bg = '#0e7490';
              else if (step?.type === 'back') bg = '#312e81';

              return (
                <div key={`${r}-${c}`} style={{...s.cell, background: bg, border: isCur ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.05)'}}>
                  {isCur ? (status === 'burnt' ? '💀' : '🐭') : (
                    <>
                      {val === 'KEY' && !hasKey && '🗝️'}
                      {val === 'DOOR' && (hasKey ? '🔓' : '🚪')}
                      {val === 'FIRE' && '🔥'}
                      {r === GRID-1 && c === GRID-1 && '🧀'}
                    </>
                  )}
                </div>
              );
            }))}
          </div>
          {overlay.show && (
            <div style={{...s.overlay, background: overlay.bg}}>
              <div style={{fontSize: '50px'}}>{overlay.icon}</div>
              <div style={{fontSize: '20px', fontWeight: 'bold', margin: '10px 0'}}>{overlay.title}</div>
              
              {overlay.stats && (
                <div style={s.reportCard}>
                  <div style={s.reportTitle}>ALGORITHM REPORT</div>
                  <div style={s.reportRow}><span>Mission Clear:</span> <span style={{color: '#34d399'}}>+{overlay.stats.baseScore}</span></div>
                  <div style={s.reportRow}><span>Speed ({overlay.stats.execTime}ms):</span> <span style={{color: '#34d399'}}>+{overlay.stats.speedBonus}</span></div>
                  <div style={s.reportRow}><span>Path ({overlay.stats.forwardSteps} steps):</span> <span style={{color: '#34d399'}}>+{overlay.stats.pathBonus}</span></div>
                  <div style={s.reportDivider}></div>
                  <div style={s.reportTotal}><span>TOTAL EARNED:</span> <span style={{color: '#fbbf24'}}>+{overlay.stats.totalEarned} 🪙</span></div>
                </div>
              )}

              <button style={s.overlayBtn} onClick={overlay.mode==='win' ? newLevel : ()=>setOverlay({show:false})}>{overlay.btn}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  root: { height: '100vh', background: '#020617', color: '#f8fafc', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'monospace' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '12px 20px', borderRadius: '8px', border: '1px solid #1e293b' },
  title: { fontSize: '18px', fontWeight: 'bold', color: '#22d3ee', letterSpacing: '1px' },
  btnRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  coinDisplay: { background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid #fbbf24', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', marginRight: '10px' },
  btnReset: { background: '#1e293b', color: '#cbd5e1', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSol: { background: '#312e81', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnRun: { background: 'linear-gradient(to right, #0891b2, #2563eb)', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  main: { display: 'flex', flex: 1, gap: '15px', minHeight: 0 },
  editorPanel: { flex: 1.2, background: '#0f172a', borderRadius: '8px', display: 'flex', flexDirection: 'column', border: '1px solid #1e293b' },
  bar: { padding: '8px 15px', background: '#1e293b', fontSize: '12px', color: '#94a3b8' },
  textarea: { flex: 1, background: 'transparent', color: '#67e8f9', padding: '15px', border: 'none', resize: 'none', outline: 'none', fontSize: '13px', lineHeight: '1.6' },
  speedBar: { padding: '10px', background: '#0f172a', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' },
  gamePanel: { flex: 1, background: '#0f172a', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid #1e293b' },
  gridWrap: { display: 'grid', gap: '3px' },
  cell: { width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', borderRadius: '3px', transition: 'all 0.2s' },
  aiBar: { position: 'absolute', top: '20px', color: '#94a3b8', fontSize: '12px' },
  overlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, borderRadius: '8px', backdropFilter: 'blur(4px)' },
  overlayBtn: { padding: '10px 25px', borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: 'white', color: 'black', marginTop: '10px' },
  reportCard: { background: 'rgba(0,0,0,0.6)', border: '1px solid #374151', padding: '20px', borderRadius: '8px', width: '300px', marginBottom: '20px', textAlign: 'left' },
  reportTitle: { color: '#94a3b8', fontSize: '12px', letterSpacing: '2px', marginBottom: '15px', borderBottom: '1px dashed #374151', paddingBottom: '5px' },
  reportRow: { display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '14px', marginBottom: '8px' },
  reportDivider: { height: '1px', background: '#374151', margin: '15px 0' },
  reportTotal: { display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '18px', fontWeight: 'bold' }
};

export default AlgoYudhRatMaze;