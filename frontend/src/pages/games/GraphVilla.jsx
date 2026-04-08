import React, { useState, useEffect, useRef } from 'react';

const GRID = 11;

const AlgoYudhRatMaze = () => {
  const animTimer = useRef(null);
  
  // --- Yeh raha sirf Boilerplate code jo user ko dikhega ---
  const initialBoilerplate = `function solve(maze, start, end, size) {
  const path = [];
  const visited = Array(size).fill().map(
    () => Array(size).fill().map(() => [false, false])
  );

  function backtrack(r, c, hasKey) {
    // 1. Boundary check
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    
    // 2. Wall check (1 means wall)
    if (maze[r][c] === 1) return false;

    // TODO: 3. Fire check (maze[r][c] === 'FIRE')
    
    // TODO: 4. Door check (maze[r][c] === 'DOOR' needs key!)

    // TODO: 5. Key pickup (Check if maze[r][c] === 'KEY')
    let currentKey = hasKey;

    // 6. Visited check (key state matters to avoid loops)
    let kIdx = currentKey ? 1 : 0;
    if (visited[r][c][kIdx]) return false;

    // Record the move
    path.push({ r, c, type: 'forward', hasKey: currentKey });
    visited[r][c][kIdx] = true;

    // Target reached?
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
  const [aiMsg, setAiMsg] = useState("AI Coach: Ready to code? Complete the TODOs!");
  const [speed, setSpeed] = useState(150);
  const [overlay, setOverlay] = useState({ show: false, icon: '', title: '', btn: '', bg: '' });
  const [hintVisible, setHintVisible] = useState(false);

  // --- Maze Generation Logic (Ported) ---
  const bfs = (m, start, target, noFire) => {
    let q = [start], vis = new Set([start[0] + ',' + start[1]]);
    while (q.length) {
      let [r, c] = q.shift();
      if (r === target[0] && c === target[1]) return true;
      for (let [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        let nr = r + dr, nc = c + dc, key = nr + ',' + nc;
        if (nr < 0 || nc < 0 || nr >= GRID || nc >= GRID) continue;
        if (m[nr][nc] === 1) continue;
        if (noFire && m[nr][nc] === 'FIRE') continue;
        if (!vis.has(key)) { vis.add(key); q.push([nr, nc]); }
      }
    }
    return false;
  };

  const getPath = (m, start, target) => {
    let parent = {}, q = [start], vis = new Set([start[0] + ',' + start[1]]);
    while (q.length) {
      let [r, c] = q.shift();
      if (r === target[0] && c === target[1]) {
        let path = [], cur = target;
        while (cur) { path.push(cur); cur = parent[cur[0] + ',' + cur[1]]; }
        return path.reverse();
      }
      for (let [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
        let nr = r + dr, nc = c + dc, key = nr + ',' + nc;
        if (nr < 0 || nc < 0 || nr >= GRID || nr >= GRID || m[nr][nc] === 1 || vis.has(key)) continue;
        vis.add(key); parent[key] = [r, c]; q.push([nr, nc]);
      }
    }
    return [];
  };

  const newLevel = () => {
    clearInterval(animTimer.current);
    setSteps([]); setVizIdx(-1); setStatus('idle'); setHasKey(false);
    setOverlay({ show: false });
    
    let m = Array(GRID).fill(0).map(() => Array(GRID).fill(1));
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
    carve(0, 0); m[GRID - 1][GRID - 1] = 0;

    let rawPath = getPath(m, [0, 0], [GRID - 1, GRID - 1]);
    let doorCell = rawPath[Math.floor(rawPath.length * 0.55)] || [5, 5];
    
    let keyCell = null;
    for (let i = 0; i < 200; i++) {
      let r = Math.floor(Math.random() * GRID), c = Math.floor(Math.random() * GRID);
      if (m[r][c] === 0 && !(r === 0 && c === 0) && !(r === doorCell[0] && c === doorCell[1])) {
        let testM = m.map(row => [...row]); testM[doorCell[0]][doorCell[1]] = 1;
        if (bfs(testM, [0, 0], [r, c], false)) { keyCell = [r, c]; break; }
      }
    }
    if (!keyCell) keyCell = [0, GRID - 1];

    m[doorCell[0]][doorCell[1]] = 'DOOR';
    m[keyCell[0]][keyCell[1]] = 'KEY';

    let fireCount = 0;
    for (let i = 0; i < 300 && fireCount < 5; i++) {
      let r = Math.floor(Math.random() * GRID), c = Math.floor(Math.random() * GRID);
      if (m[r][c] === 0 && !(r === 0 && c === 0) && !(r === GRID - 1 && c === GRID - 1)) {
        m[r][c] = 'FIRE';
        let t1 = m.map(x => [...x]); t1[doorCell[0]][doorCell[1]] = 0;
        if (bfs(m, [0, 0], keyCell, true) && bfs(t1, keyCell, [GRID - 1, GRID - 1], true)) fireCount++;
        else m[r][c] = 0;
      }
    }
    setMaze(m);
    setAiMsg("AI Coach: Complete the TODOs to reach the cheese!");
  };

  useEffect(() => { newLevel(); }, []);

  const runCode = (manualCode = null) => {
    clearInterval(animTimer.current);
    setSteps([]); setVizIdx(-1); setHasKey(false); setStatus('idle'); setOverlay({ show: false });
    const codeToRun = manualCode || code;
    try {
      const fn = new Function('maze', 'start', 'end', 'size', codeToRun + '; return solve(maze,start,end,size);');
      const p = fn(maze.map(r => [...r]), { r: 0, c: 0 }, { r: GRID - 1, c: GRID - 1 }, GRID);
      if (!Array.isArray(p) || p.length === 0) { setAiMsg("AI Coach: Path empty! Check your logic."); return; }
      setSteps(p);
      animate(p);
    } catch (e) { setAiMsg('AI Coach: Error: ' + e.message.slice(0, 40)); }
  };

  const animate = (path) => {
    setStatus('running');
    let idx = 0;
    let localKey = false;
    animTimer.current = setInterval(() => {
      if (idx >= path.length) { clearInterval(animTimer.current); setStatus('done'); return; }
      const s = path[idx];
      const cell = maze[s.r][s.c];

      if (cell === 'KEY') { localKey = true; setHasKey(true); }
      if (cell === 'FIRE') {
        clearInterval(animTimer.current); setStatus('burnt'); setVizIdx(idx);
        setTimeout(() => setOverlay({ show: true, icon: '💀🔥', title: 'Rat Burnt!', btn: 'Try Again', bg: 'rgba(69,10,10,0.95)' }), 300);
        return;
      }
      if (cell === 'DOOR' && !localKey) {
        clearInterval(animTimer.current); setStatus('locked'); setVizIdx(idx);
        setTimeout(() => setOverlay({ show: true, icon: '🔒', title: 'Door Locked!', btn: 'Try Again', bg: 'rgba(15,23,42,0.95)' }), 200);
        return;
      }

      setVizIdx(idx);
      if (s.r === GRID - 1 && s.c === GRID - 1 && idx === path.length - 1) {
        clearInterval(animTimer.current); setStatus('win');
        setTimeout(() => setOverlay({ show: true, icon: '🧀🏆', title: 'Success!', btn: 'Next Level', bg: 'rgba(2,44,20,0.95)', mode: 'win' }), 200);
      }
      idx++;
    }, speed);
  };

  const autoPlay = () => {
    const fullSolution = `function solve(maze, start, end, size) {
  const path = [];
  const visited = Array(size).fill().map(() => Array(size).fill().map(() => [false, false]));
  function backtrack(r, c, hasKey) {
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    if (maze[r][c] === 1 || maze[r][c] === 'FIRE') return false;
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
  return backtrack(0, 0, false) ? path : [];
}`;
    setCode(fullSolution);
    setTimeout(() => runCode(fullSolution), 200);
  };

  return (
    <div style={s.root}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={s.header}>
        <div style={s.title}>ALGO YUDH: RAT MAZE</div>
        <div style={s.btnRow}>
          <button style={{...s.btn, ...s.btnNew}} onClick={newLevel}>NEW LEVEL</button>
          <button style={{...s.btn, ...s.btnAuto}} onClick={autoPlay}>GET SOLUTION</button>
          <button style={{...s.btn, ...s.btnRun}} onClick={() => runCode()}>DEPLOY</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.editorPanel}>
          <div style={s.editorBar}>
            <span style={s.editorLabel}>EDITOR</span>
            <button style={s.hintBtn} onClick={() => setHintVisible(!hintVisible)}>HINT</button>
          </div>
          {hintVisible && (
            <div style={s.hintBox}>
              1. maze[r][c] === 'FIRE' return false.<br/>
              2. maze[r][c] === 'DOOR' && !hasKey return false.<br/>
              3. if (maze[r][c] === 'KEY') currentKey = true.
            </div>
          )}
          <textarea style={s.textarea} value={code} onChange={(e) => setCode(e.target.value)} spellCheck="false" />
          <div style={s.speedRow}>
            <span style={s.speedLabel}>SPEED:</span>
            <input type="range" min="50" max="800" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
            <span style={{fontSize: '10px', color: '#94a3b8'}}>{speed}</span>
          </div>
        </div>

        <div style={s.gamePanel}>
          <div style={s.aiBar}>{aiMsg}</div>
          <div style={{...s.gridWrap, gridTemplateColumns: `repeat(${GRID}, 30px)`}}>
            {maze.map((row, r) => row.map((val, c) => {
              const step = steps.slice(0, vizIdx + 1).find(st => st.r === r && st.c === c);
              const isCur = steps[vizIdx]?.r === r && steps[vizIdx]?.c === c;
              let bg = 'rgba(0,0,0,0.3)';
              if (val === 1) bg = '#1e293b';
              else if (val === 'FIRE') bg = '#450a0a';
              else if (val === 'DOOR') bg = hasKey ? '#14532d' : '#431407';
              else if (val === 'KEY' && !hasKey) bg = '#422006';
              else if (step?.type === 'forward') bg = 'rgba(34,211,238,0.2)';
              else if (step?.type === 'back') bg = 'rgba(234,88,12,0.1)';

              return (
                <div key={`${r}-${c}`} style={{...s.cell, background: bg}}>
                  {isCur ? (
                    <span style={{fontSize: '14px', position: 'relative', animation: status === 'burnt' ? 'shake 0.3s infinite' : 'none'}}>
                      {status === 'burnt' ? '💀' : '🐭'}
                      {hasKey && <span style={{position:'absolute', top:'-4px', right:'-4px', fontSize:'8px'}}>🗝️</span>}
                    </span>
                  ) : (
                    <>
                      {val === 'KEY' && !hasKey && <span style={{animation: 'pulse 1.5s infinite'}}>🗝️</span>}
                      {val === 'DOOR' && (hasKey ? '🔓' : '🚪')}
                      {val === 'FIRE' && '🔥'}
                      {r === GRID - 1 && c === GRID - 1 && val !== 'FIRE' && '🧀'}
                    </>
                  )}
                </div>
              );
            }))}
          </div>
          {overlay.show && (
            <div style={{...s.overlay, background: overlay.bg}}>
              <div style={s.overlayIcon}>{overlay.icon}</div>
              <div style={s.overlayTitle}>{overlay.title}</div>
              <button style={s.overlayBtn} onClick={overlay.mode === 'win' ? newLevel : () => setOverlay({show:false})}>{overlay.btn}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  root: { minHeight: '100vh', background: '#050510', color: '#e2e8f0', fontFamily: "monospace", padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111122', padding: '10px 16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.1)' },
  title: { fontSize: '16px', fontWeight: '900', color: '#22d3ee', fontStyle: 'italic' },
  btnRow: { display: 'flex', gap: '8px' },
  btn: { padding: '6px 14px', borderRadius: '6px', fontWeight: '700', fontSize: '11px', cursor: 'pointer', border: 'none' },
  btnNew: { background: '#1e293b', color: '#67e8f9' },
  btnAuto: { background: '#4338ca', color: 'white' },
  btnRun: { background: 'linear-gradient(90deg,#0891b2,#1d4ed8)', color: 'white' },
  main: { display: 'flex', gap: '10px', flex: 1 },
  editorPanel: { flex: 1, background: '#0c0c1e', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' },
  editorBar: { display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255,255,255,0.04)' },
  editorLabel: { fontSize: '10px', color: '#eab308', letterSpacing: '2px' },
  hintBtn: { background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '11px' },
  hintBox: { background: '#fbbf24', color: '#000', padding: '10px', fontSize: '10px', borderRadius: '8px', margin: '8px 12px' },
  textarea: { flex: 1, background: 'transparent', padding: '12px', color: '#a5f3fc', fontSize: '11px', lineHeight: '1.6', resize: 'none', outline: 'none', border: 'none', fontFamily: 'monospace' },
  speedRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)' },
  speedLabel: { fontSize: '10px', color: '#94a3b8' },
  gamePanel: { width: '400px', background: '#0d0d1a', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.07)', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gridWrap: { display: 'inline-grid', gap: '5px' },
  cell: { width: '30px', height: '30px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  overlay: { position: 'absolute', inset: 0, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(8px)' },
  overlayIcon: { fontSize: '52px' },
  overlayTitle: { fontSize: '20px', color: 'white', letterSpacing: '2px' },
  overlayBtn: { marginTop: '20px', padding: '10px 28px', background: 'white', borderRadius: '999px', border: 'none', cursor: 'pointer' },
  aiBar: { fontSize: '10px', color: '#94a3b8', padding: '4px 0' }
};

export default AlgoYudhRatMaze;