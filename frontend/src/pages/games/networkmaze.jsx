import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─── INITIAL CODE ─────────────────────────────────────────────── */
const INITIAL_CODE = `function solve(grid, size) {
  const path = [];
  const visited = Array(size).fill(null)
    .map(() => Array(size).fill(false));

  function dfs(r, c) {
    if (
      r < 0 || c < 0 ||
      r >= size || c >= size ||
      grid[r][c] === 1 ||
      visited[r][c]
    ) return false;

    visited[r][c] = true;
    path.push({ r, c });

    if (r === size - 1 && c === size - 1) return true;

    if (dfs(r, c + 1)) return true;
    if (dfs(r + 1, c)) return true;
    if (dfs(r, c - 1)) return true;
    if (dfs(r - 1, c)) return true;

    path.push({ r, c });
    return false;
  }

  dfs(0, 0);
  return path;
}`;

const SIZE = 8;

/* ─── CELL ─────────────────────────────────────────────────────── */
const Cell = React.memo(({ r, c, isWall, stepType, isCurrent, isStart, isEnd }) => {
  const base =
    "relative w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono transition-all duration-200 select-none";

  const bg =
    isWall
      ? "bg-slate-700/80 border border-slate-600/40"
      : isStart
      ? "bg-emerald-900/60 border border-emerald-500/50"
      : isEnd
      ? "bg-violet-900/60 border border-violet-500/50"
      : stepType === "forward"
      ? "bg-cyan-500/30 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
      : stepType === "backtrack"
      ? "bg-orange-500/20 border border-orange-400/40"
      : "bg-slate-900/70 border border-slate-700/30";

  const scale = isCurrent ? "scale-110 z-10" : "scale-100";
  const glow = isCurrent
    ? "shadow-[0_0_16px_rgba(250,204,21,0.7)] border-yellow-400 bg-yellow-500/20"
    : "";

  return (
    <div className={`${base} ${bg} ${scale} ${glow}`}>
      {isStart && !isCurrent && (
        <span className="text-emerald-400 text-[10px]">S</span>
      )}
      {isEnd && !isCurrent && (
        <span className="text-violet-400 text-[10px]">E</span>
      )}
      {isCurrent && <span className="text-yellow-300 text-base animate-pulse">◉</span>}
      {stepType === "forward" && !isCurrent && (
        <span className="absolute inset-0 rounded-lg bg-cyan-400/10 animate-ping" />
      )}
    </div>
  );
});

/* ─── MAIN ─────────────────────────────────────────────────────── */
const NetworkMaze = ({ onBack }) => {
  const [grid, setGrid] = useState([]);
  const [code, setCode] = useState(INITIAL_CODE);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [vizIndex, setVizIndex] = useState(-1);
  const [logs, setLogs] = useState([{ t: "info", m: "// Ready — write your solve() and run." }]);
  const [status, setStatus] = useState("idle"); // idle | running | success | failed
  const [stats, setStats] = useState({ steps: 0, backtracks: 0, time: 0 });
  const timerRef = useRef(null);
  const logRef = useRef(null);

  /* ── generate grid ── */
  const generateGrid = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const g = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
    for (let i = 0; i < SIZE * 2; i++) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (!(r === 0 && c === 0) && !(r === SIZE - 1 && c === SIZE - 1)) {
        g[r][c] = 1;
      }
    }
    setGrid(g);
    setVizIndex(-1);
    setAnimationSteps([]);
    setLogs([{ t: "info", m: "// New maze generated. Ready." }]);
    setStatus("idle");
    setStats({ steps: 0, backtracks: 0, time: 0 });
  }, []);

  useEffect(() => { generateGrid(); }, [generateGrid]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = useCallback((type, msg) => {
    setLogs(l => [...l.slice(-50), { t: type, m: msg }]);
  }, []);

  /* ── process steps ── */
  const processSteps = useCallback((path) => {
    const seen = new Set();
    return path.map(p => {
      const key = `${p.r}-${p.c}`;
      if (seen.has(key)) return { ...p, type: "backtrack" };
      seen.add(key);
      return { ...p, type: "forward" };
    });
  }, []);

  /* ── run ── */
  const runCode = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setVizIndex(-1);
    setAnimationSteps([]);
    setStatus("running");
    setLogs([{ t: "run", m: "▶ Executing solve(grid, size)..." }]);

    const startTime = performance.now();

    try {
      const fn = new Function("grid", "size", `${code}\nreturn solve(grid, size);`);
      const raw = fn(grid, SIZE);

      if (!Array.isArray(raw)) throw new Error("solve() must return an array of {r, c} steps");

      const processed = processSteps(raw);
      const elapsed = (performance.now() - startTime).toFixed(1);
      const fwdCount = processed.filter(s => s.type === "forward").length;
      const btCount  = processed.filter(s => s.type === "backtrack").length;

      setAnimationSteps(processed);
      addLog("info", `↳ ${processed.length} steps computed in ${elapsed}ms`);
      addLog("info", `↳ ${fwdCount} forward, ${btCount} backtracks`);

      let i = 0;
      timerRef.current = setInterval(() => {
        if (i >= processed.length) {
          clearInterval(timerRef.current);
          const last = processed[processed.length - 1];
          const won = last?.r === SIZE - 1 && last?.c === SIZE - 1;
          setStatus(won ? "success" : "failed");
          setStats({ steps: fwdCount, backtracks: btCount, time: elapsed });
          addLog(won ? "success" : "error", won ? "✓ Destination reached — API success" : "✗ Path did not reach destination");
          return;
        }
        const step = processed[i];
        setVizIndex(i);
        if (step.type === "backtrack" && i % 3 === 0) {
          addLog("warn", `↩ Backtracking at [${step.r},${step.c}]`);
        }
        i++;
      }, 70);

    } catch (err) {
      setStatus("failed");
      addLog("error", `✗ ${err.message}`);
    }
  }, [code, grid, processSteps, addLog]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  /* ── cell state map (perf) ── */
  const cellStateMap = useMemo(() => {
    const map = {};
    animationSteps.slice(0, vizIndex + 1).forEach(s => {
      map[`${s.r}-${s.c}`] = s.type;
    });
    return map;
  }, [animationSteps, vizIndex]);

  const current = animationSteps[vizIndex];

  const logColor = { info: "text-slate-400", run: "text-cyan-400", warn: "text-orange-400", error: "text-red-400", success: "text-emerald-400" };

  const statusBadge = {
    idle:    "text-slate-400 bg-slate-800 border-slate-700",
    running: "text-cyan-400  bg-cyan-950   border-cyan-800 animate-pulse",
    success: "text-emerald-400 bg-emerald-950 border-emerald-800",
    failed:  "text-red-400  bg-red-950    border-red-800",
  };

  return (
    <div className="flex h-screen bg-[#060a10] text-slate-100 font-mono overflow-hidden">

      {/* ── scan-line overlay ── */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,transparent 1px,transparent 4px)" }} />

      {/* ══ LEFT: IDE ══ */}
      <div className="w-[52%] flex flex-col border-r border-slate-800">

        {/* header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xs text-slate-500">solve.js</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] px-2 py-0.5 rounded border ${statusBadge[status]}`}>
              {status.toUpperCase()}
            </span>
            {onBack && (
              <button onClick={onBack}
                className="text-xs text-slate-500 hover:text-slate-300 transition px-2 py-1 rounded border border-slate-700 hover:border-slate-500">
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* editor */}
        <div className="relative flex-1 overflow-hidden">
          {/* line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-900/40 border-r border-slate-800 flex flex-col items-end pt-4 pr-2 gap-0 overflow-hidden pointer-events-none">
            {code.split("\n").map((_, i) => (
              <span key={i} className="text-[11px] text-slate-700 leading-[1.6rem]">{i + 1}</span>
            ))}
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="absolute inset-0 bg-transparent text-emerald-300 text-sm leading-relaxed pl-12 pr-4 pt-4 pb-4 outline-none resize-none caret-cyan-400"
            style={{ fontFamily: "'Fira Code', 'Cascadia Code', monospace", tabSize: 2 }}
          />
        </div>

        {/* run button */}
        <button onClick={runCode}
          disabled={status === "running"}
          className="flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border-y border-cyan-500/20 text-cyan-400 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
          {status === "running"
            ? <><span className="animate-spin">⟳</span> Running...</>
            : <>▶ RUN CODE</>}
        </button>

        {/* stats bar */}
        {status !== "idle" && (
          <div className="flex gap-4 px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-[11px]">
            <span className="text-slate-500">Steps: <span className="text-cyan-400">{stats.steps}</span></span>
            <span className="text-slate-500">Backtracks: <span className="text-orange-400">{stats.backtracks}</span></span>
            <span className="text-slate-500">Time: <span className="text-slate-300">{stats.time}ms</span></span>
          </div>
        )}

        {/* console */}
        <div ref={logRef} className="h-44 bg-black/60 p-3 overflow-y-auto text-[12px] leading-5 space-y-0.5">
          <div className="text-slate-600 text-[10px] mb-1 uppercase tracking-widest">Console</div>
          {logs.map((l, i) => (
            <div key={i} className={logColor[l.t] || "text-slate-400"}>{l.m}</div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT: MAZE ══ */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 relative overflow-hidden">

        {/* ambient bg glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        {/* title */}
        <div className="text-center">
          <h1 className="text-lg text-cyan-400 tracking-widest uppercase font-bold">Network Maze</h1>
          <p className="text-xs text-slate-600 mt-0.5">Route packets from S → E</p>
        </div>

        {/* grid */}
        <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur shadow-2xl">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`;
                return (
                  <Cell
                    key={key}
                    r={r} c={c}
                    isWall={cell === 1}
                    stepType={cellStateMap[key]}
                    isCurrent={current?.r === r && current?.c === c}
                    isStart={r === 0 && c === 0}
                    isEnd={r === SIZE - 1 && c === SIZE - 1}
                  />
                );
              })
            )}
          </div>

          {/* legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-700 border border-slate-600/40 inline-block" /> Wall</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-400/70 inline-block" /> Visited</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500/20 border border-orange-400/40 inline-block" /> Backtrack</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-500/20 border border-yellow-400 inline-block" /> Current</span>
          </div>
        </div>

        {/* new maze button */}
        <button onClick={generateGrid}
          className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-500 px-4 py-1.5 rounded-lg transition">
          ⟳ New Maze
        </button>

        {/* success overlay */}
        {status === "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center animate-bounce">
              <div className="text-5xl mb-2">✓</div>
              <div className="text-emerald-400 font-bold text-xl tracking-wider">SUCCESS</div>
              <div className="text-slate-500 text-xs mt-1">{stats.steps} nodes traversed</div>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
            <div className="text-center">
              <div className="text-5xl mb-2">✗</div>
              <div className="text-red-400 font-bold text-xl tracking-wider">NO PATH FOUND</div>
              <button onClick={generateGrid}
                className="mt-3 text-xs text-slate-400 border border-slate-700 px-3 py-1 rounded hover:border-slate-500 transition">
                Try new maze
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkMaze;