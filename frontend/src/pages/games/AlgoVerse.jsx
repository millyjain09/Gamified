import { useState, useEffect, useRef, useCallback } from "react";

// ─── Color palette & theme ───────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0a0f",
  surface: "#111118",
  card: "#16161f",
  border: "#2a2a3a",
  borderHover: "#444460",
  accent: "#6c63ff",
  accentGlow: "#6c63ff44",
  green: "#00e5a0",
  greenDim: "#00e5a022",
  red: "#ff4d6d",
  redDim: "#ff4d6d22",
  amber: "#ffb800",
  amberDim: "#ffb80022",
  textPrimary: "#f0f0ff",
  textSecondary: "#8888aa",
  textMuted: "#555570",
};

// ─── Algorithm definitions ───────────────────────────────────────────────────
const ALGORITHMS = [
  {
    id: "bubble",
    answer: "Bubble Sort",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
    hint: "Watch how adjacent elements interact each pass",
    hardHint: "Nearly sorted — only a few swaps remain, don't blink",
    explain: "Adjacent elements swap repeatedly — largest bubbles to the end each pass.",
    color: "#6c63ff",
    getArray: (hard) => hard ? [1,2,3,5,4,6,7,8,9,10] : [9,7,5,3,1,8,6,4,2,10],
  },
  {
    id: "merge",
    answer: "Merge Sort",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Radix Sort"],
    hint: "Notice how the array splits and recombines",
    hardHint: "Watch carefully — the split could be Merge or Quick Sort",
    explain: "Divide into halves recursively, sort each half, then merge them together.",
    color: "#00e5a0",
    getArray: () => [8,3,5,1,9,2,7,4],
  },
  {
    id: "bfs",
    answer: "BFS",
    options: ["BFS", "DFS", "Dijkstra's", "Prim's"],
    hint: "Watch which nodes light up and in what order",
    hardHint: "Level 1 completes before level 2 starts — not depth-first",
    explain: "Explores level by level — all neighbors before going deeper. Classic BFS!",
    color: "#00b4d8",
    getArray: () => null,
  },
  {
    id: "dfs",
    answer: "DFS",
    options: ["DFS", "BFS", "A*", "Bellman-Ford"],
    hint: "Follow the path — it goes as deep as possible first",
    hardHint: "Dives all the way down one branch before backtracking",
    explain: "Goes deep before backtracking — follows one path fully before exploring others.",
    color: "#ff6b6b",
    getArray: () => null,
  },
  {
    id: "insertion",
    answer: "Insertion Sort",
    options: ["Insertion Sort", "Bubble Sort", "Shell Sort", "Selection Sort"],
    hint: "The left portion stays sorted throughout",
    hardHint: "Like sorting cards in hand — each element finds its spot on the left",
    explain: "Each element is inserted into its correct position in the already-sorted left side.",
    color: "#f9c74f",
    getArray: (hard) => hard ? [3,1,4,1,5,9,2,6] : [5,2,4,6,1,3,7],
  },
  {
    id: "selection",
    answer: "Selection Sort",
    options: ["Selection Sort", "Insertion Sort", "Bubble Sort", "Merge Sort"],
    hint: "One swap per pass — a scan hunts for the minimum",
    hardHint: "The red bar scans the entire unsorted portion each time",
    explain: "Scans the unsorted portion for the minimum, swaps it to the front — one swap per pass.",
    color: "#ff9f1c",
    getArray: () => [6,3,8,2,7,4,1,5],
  },
];

// ─── Graph data for BFS/DFS ──────────────────────────────────────────────────
const NODES = [
  { id:0, x:0.5,  y:0.12, label:"A" },
  { id:1, x:0.28, y:0.38, label:"B" },
  { id:2, x:0.72, y:0.38, label:"C" },
  { id:3, x:0.14, y:0.68, label:"D" },
  { id:4, x:0.42, y:0.68, label:"E" },
  { id:5, x:0.60, y:0.68, label:"F" },
  { id:6, x:0.86, y:0.68, label:"G" },
];
const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
const BFS_ORDER = [0,1,2,3,4,5,6];
const DFS_ORDER = [0,1,3,4,2,5,6];

// ─── Drawing functions ───────────────────────────────────────────────────────
function drawBubble(ctx, W, H, tick, hard, algoColor) {
  const arr = hard ? [1,2,3,5,4,6,7,8,9,10] : [9,7,5,3,1,8,6,4,2,10];
  let a = [...arr];
  let swapIdx = -1;
  const pass = Math.floor(tick / 3) % (a.length * 2);
  for (let i = 0; i < Math.min(pass, a.length - 1); i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; swapIdx = j; }
    }
  }
  drawBars(ctx, a, W, H, swapIdx, algoColor);
}

function drawBars(ctx, arr, W, H, highlightIdx, color) {
  const n = arr.length;
  const maxV = Math.max(...arr);
  const gap = 4;
  const bw = (W - gap * (n + 1)) / n;
  ctx.clearRect(0, 0, W, H);
  arr.forEach((v, i) => {
    const bh = ((v / maxV) * (H - 20));
    const x = gap + i * (bw + gap);
    const y = H - bh - 4;
    const isHl = i === highlightIdx || i === highlightIdx + 1;
    ctx.globalAlpha = isHl ? 1 : 0.55;
    ctx.fillStyle = isHl ? COLORS.red : color;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, 3);
    ctx.fill();
    if (isHl) {
      ctx.shadowColor = COLORS.red;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  });
}

function drawMerge(ctx, W, H, tick) {
  ctx.clearRect(0, 0, W, H);
  const arr = [8,3,5,1,9,2,7,4];
  const maxV = 9;
  const phase = Math.floor(tick / 4) % 4;
  const n = arr.length;
  const gap = 4;
  const bw = (W - gap * (n + 1)) / n;

  const drawSet = (values, startIdx, color) => {
    values.forEach((v, j) => {
      const i = startIdx + j;
      const bh = (v / maxV) * (H - 20);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.roundRect(gap + i * (bw + gap), H - bh - 4, bw, bh, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };

  if (phase === 0) {
    arr.forEach((v,i) => { drawSet([v], i, COLORS.accent); });
    label(ctx, "Split into individuals", W);
  } else if (phase === 1) {
    [[3,8],[1,5],[2,9],[4,7]].forEach((p,pi) => drawSet(p.sort((a,b)=>a-b), pi*2, pi%2===0?COLORS.green:COLORS.accent));
    label(ctx, "Merge pairs", W);
  } else if (phase === 2) {
    drawSet([1,3,5,8], 0, COLORS.green);
    drawSet([2,4,7,9], 4, COLORS.amber);
    label(ctx, "Merge halves", W);
  } else {
    drawSet([1,2,3,4,5,7,8,9], 0, COLORS.green);
    label(ctx, "Fully sorted", W);
  }
}

function label(ctx, text, W) {
  ctx.fillStyle = COLORS.textSecondary;
  ctx.font = "500 11px 'DM Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(text.toUpperCase(), W / 2, 14);
  ctx.textAlign = "left";
}

function drawGraph(ctx, W, H, tick, type) {
  ctx.clearRect(0, 0, W, H);
  const order = type === "bfs" ? BFS_ORDER : DFS_ORDER;
  const step = Math.floor(tick / 2.5) % (order.length + 2);
  const visited = order.slice(0, step);
  const current = visited[visited.length - 1];

  EDGES.forEach(([a, b]) => {
    const na = NODES[a], nb = NODES[b];
    const bothVisited = visited.includes(a) && visited.includes(b);
    ctx.beginPath();
    ctx.moveTo(na.x * W, na.y * H);
    ctx.lineTo(nb.x * W, nb.y * H);
    ctx.strokeStyle = bothVisited ? COLORS.accent + "88" : COLORS.border;
    ctx.lineWidth = bothVisited ? 2 : 1;
    ctx.stroke();
  });

  NODES.forEach((n) => {
    const isVisited = visited.includes(n.id);
    const isCurrent = current === n.id;
    const x = n.x * W, y = n.y * H, r = 18;

    if (isCurrent) {
      ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.accent + "33"; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isCurrent ? COLORS.accent : isVisited ? COLORS.accentGlow + "aa" : COLORS.surface;
    ctx.fill();
    ctx.strokeStyle = isCurrent ? COLORS.accent : isVisited ? COLORS.accent + "88" : COLORS.border;
    ctx.lineWidth = isCurrent ? 2 : 1; ctx.stroke();

    ctx.fillStyle = isCurrent ? "#fff" : isVisited ? COLORS.accent : COLORS.textMuted;
    ctx.font = `600 12px 'Space Grotesk', sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(n.label, x, y);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    if (isVisited) {
      const rank = visited.indexOf(n.id) + 1;
      ctx.fillStyle = COLORS.amber;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(rank, x + 14, y - 12);
      ctx.textAlign = "left";
    }
  });
}

function drawInsertion(ctx, W, H, tick, hard) {
  const arr = hard ? [3,1,4,1,5,9,2,6] : [5,2,4,6,1,3,7];
  const a = [...arr];
  const n = arr.length;
  const step = Math.floor(tick / 3) % (n + 1);
  for (let i = 1; i <= step && i < n; i++) {
    let j = i;
    while (j > 0 && a[j-1] > a[j]) { [a[j], a[j-1]] = [a[j-1], a[j]]; j--; }
  }
  const gap = 4, bw = (W - gap * (n + 1)) / n, maxV = Math.max(...arr);
  ctx.clearRect(0, 0, W, H);
  a.forEach((v, i) => {
    const bh = (v / maxV) * (H - 20);
    ctx.fillStyle = i < step ? COLORS.green : i === step ? COLORS.amber : COLORS.textMuted + "55";
    ctx.globalAlpha = i === step ? 1 : 0.7;
    ctx.beginPath(); ctx.roundRect(gap + i*(bw+gap), H-bh-4, bw, bh, 3); ctx.fill();
    ctx.globalAlpha = 1;
  });
  if (step > 0) label(ctx, `Left ${step} element${step>1?"s":""} sorted`, W);
}

function drawSelection(ctx, W, H, tick) {
  const arr = [6,3,8,2,7,4,1,5];
  const a = [...arr];
  const n = arr.length;
  const pass = Math.floor(tick / 3) % (n + 1);
  for (let i = 0; i < pass; i++) {
    let m = i;
    for (let j = i+1; j < n; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
  const scan = pass + Math.floor((tick % 3));
  const gap = 4, bw = (W - gap * (n + 1)) / n, maxV = Math.max(...arr);
  ctx.clearRect(0, 0, W, H);
  a.forEach((v, i) => {
    const bh = (v / maxV) * (H - 20);
    const isSorted = i < pass;
    const isScanning = i === Math.min(scan, n-1);
    ctx.fillStyle = isSorted ? COLORS.green : isScanning ? COLORS.red : COLORS.accent + "55";
    ctx.globalAlpha = isSorted ? 0.8 : isScanning ? 1 : 0.5;
    ctx.beginPath(); ctx.roundRect(gap + i*(bw+gap), H-bh-4, bw, bh, 3); ctx.fill();
    if (isScanning) {
      ctx.shadowColor = COLORS.red; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  });
  label(ctx, "Scanning for minimum...", W);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GuessTheAlgorithm() {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1);
  const [shuffledOpts, setShuffledOpts] = useState([]);
  const [phase, setPhase] = useState("playing"); // playing | end
  const [feedback, setFeedback] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [pts, setPts] = useState(0);

  const canvasRef = useRef(null);
  const tickRef = useRef(0);
  const animRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());

  const hard = streak >= 3;
  const q = questions[qIdx];
  const DURATION = hard ? 8000 : 12000;

  // shuffle util
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // init
  useEffect(() => {
    setQuestions(shuffle(ALGORITHMS));
  }, []);

  // load question
  useEffect(() => {
    if (!q) return;
    tickRef.current = 0;
    setAnswered(false);
    setChosen(null);
    setFeedback(null);
    setTimedOut(false);
    setPts(0);
    setShuffledOpts(shuffle(q.options));
    setTimeLeft(1);
    startRef.current = Date.now();
  }, [qIdx, q]);

  // animation loop
  useEffect(() => {
    if (!q || phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    let last = 0;

    const frame = (ts) => {
      if (ts - last > 200) { tickRef.current++; last = ts; }
      const t = tickRef.current;
      ctx.clearRect(0, 0, W, H);
      if (q.id === "bubble") drawBubble(ctx, W, H, t, hard, q.color);
      else if (q.id === "merge") drawMerge(ctx, W, H, t);
      else if (q.id === "bfs") drawGraph(ctx, W, H, t, "bfs");
      else if (q.id === "dfs") drawGraph(ctx, W, H, t, "dfs");
      else if (q.id === "insertion") drawInsertion(ctx, W, H, t, hard);
      else if (q.id === "selection") drawSelection(ctx, W, H, t);
      animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animRef.current);
  }, [q, hard, phase]);

  // timer
  useEffect(() => {
    if (!q || answered || phase !== "playing") return;
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const frac = Math.max(0, 1 - elapsed / DURATION);
      setTimeLeft(frac);
      if (frac <= 0) {
        clearInterval(timerRef.current);
        setTimedOut(true);
        setAnswered(true);
        setStreak(0);
        setFeedback({ correct: false, msg: `Time's up! It was ${q.answer}.` });
      }
    }, 60);
    return () => clearInterval(timerRef.current);
  }, [q, answered, phase, DURATION]);

  const handleAnswer = useCallback((opt) => {
    if (answered || !q) return;
    clearInterval(timerRef.current);
    setAnswered(true);
    setChosen(opt);
    const correct = opt === q.answer;
    const bonus = Math.round(timeLeft * 10);
    const earned = correct ? (hard ? 20 : 10) + bonus : 0;
    setPts(earned);
    if (correct) {
      setScore(s => s + earned);
      setStreak(s => s + 1);
      setFeedback({ correct: true, msg: q.explain });
    } else {
      setStreak(0);
      setFeedback({ correct: false, msg: q.explain });
    }
  }, [answered, q, timeLeft, hard]);

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      setPhase("end");
    } else {
      setQIdx(i => i + 1);
    }
  };

  const restart = () => {
    setQuestions(shuffle(ALGORITHMS));
    setQIdx(0);
    setScore(0);
    setStreak(0);
    setPhase("playing");
  };

  const timerColor = timeLeft > 0.5 ? COLORS.green : timeLeft > 0.25 ? COLORS.amber : COLORS.red;
  const total = ALGORITHMS.length * 20;

  // ─── End screen ──────────────────────────────────────────────────────────────
  if (phase === "end") {
    const pct = Math.round((score / total) * 100);
    const medal = pct >= 80 ? "🏆" : pct >= 50 ? "🎯" : "📚";
    const msg = pct >= 80 ? "Algorithm master!" : pct >= 50 ? "Getting there!" : "Keep practicing!";
    return (
      <div style={styles.root}>
        <div style={styles.endCard}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{medal}</div>
          <div style={styles.endTitle}>{score} <span style={{ color: COLORS.accent }}>pts</span></div>
          <div style={styles.endSub}>{msg}</div>
          <div style={styles.endMeta}>{pct}% accuracy · {ALGORITHMS.length} rounds</div>
          <button style={styles.restartBtn} onClick={restart}>Play again</button>
        </div>
        <style>{GLOBAL_CSS}</style>
      </div>
    );
  }

  if (!q) return <div style={styles.root}><div style={{ color: COLORS.textMuted }}>Loading…</div></div>;

  return (
    <div style={styles.root}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            Guess the <span style={{ color: COLORS.accent }}>Algorithm</span>
          </div>
          <div style={styles.subtitle}>Watch. Think. Choose.</div>
        </div>
        <div style={styles.scoreCluster}>
          <div style={styles.scorePill}>
            <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>SCORE</span>
            <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>{score}</span>
          </div>
          {streak >= 2 && (
            <div style={{ ...styles.scorePill, background: COLORS.amberDim, border: `1px solid ${COLORS.amber}44` }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ color: COLORS.amber, fontWeight: 700 }}>{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={styles.dotsRow}>
        {questions.map((_, i) => (
          <div key={i} style={{
            ...styles.dot,
            background: i < qIdx ? COLORS.accent : i === qIdx ? COLORS.accent + "88" : COLORS.border,
            width: i === qIdx ? 20 : 8,
          }} />
        ))}
      </div>

      {/* Timer */}
      <div style={styles.timerWrap}>
        <div style={{ ...styles.timerBar, width: `${timeLeft * 100}%`, background: timerColor, boxShadow: `0 0 8px ${timerColor}88` }} />
      </div>

      {/* Mode badge + hint */}
      <div style={styles.hintRow}>
        <div style={{ ...styles.modeBadge, background: hard ? COLORS.redDim : COLORS.greenDim, color: hard ? COLORS.red : COLORS.green, borderColor: hard ? COLORS.red + "55" : COLORS.green + "55" }}>
          {hard ? "⚡ Hard Mode" : "Normal"}
        </div>
        <div style={styles.hint}>{hard ? q.hardHint : q.hint}</div>
      </div>

      {/* Canvas */}
      <div style={styles.canvasCard}>
        <div style={styles.canvasLabel}>
          {q.id === "bfs" || q.id === "dfs" ? "Graph traversal" : "Array visualization"}
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={140}
          style={{ width: "100%", height: 140, display: "block" }}
        />
      </div>

      {/* Options */}
      <div style={styles.optGrid}>
        {shuffledOpts.map((opt) => {
          const isChosen = chosen === opt;
          const isCorrect = opt === q.answer;
          const show = answered;
          let bg = COLORS.card, border = COLORS.border, color = COLORS.textPrimary;
          if (show && isCorrect) { bg = COLORS.greenDim; border = COLORS.green; color = COLORS.green; }
          else if (show && isChosen && !isCorrect) { bg = COLORS.redDim; border = COLORS.red; color = COLORS.red; }
          else if (!answered) { bg = COLORS.card; }
          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => handleAnswer(opt)}
              style={{ ...styles.optBtn, background: bg, border: `1px solid ${border}`, color }}
              className="opt-btn"
            >
              <span style={styles.optCheck}>
                {show && isCorrect ? "✓" : show && isChosen && !isCorrect ? "✗" : ""}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{ ...styles.feedbackBox, background: feedback.correct ? COLORS.greenDim : COLORS.redDim, borderColor: feedback.correct ? COLORS.green + "55" : COLORS.red + "55" }}>
          <span style={{ color: feedback.correct ? COLORS.green : COLORS.red, fontWeight: 600 }}>
            {feedback.correct ? `+${pts} pts  ` : "Wrong.  "}
          </span>
          <span style={{ color: COLORS.textSecondary }}>{feedback.msg}</span>
        </div>
      )}
      {timedOut && !feedback && (
        <div style={{ ...styles.feedbackBox, background: COLORS.redDim, borderColor: COLORS.red + "44" }}>
          <span style={{ color: COLORS.red, fontWeight: 600 }}>Time's up!  </span>
          <span style={{ color: COLORS.textSecondary }}>The answer was <b style={{ color: COLORS.textPrimary }}>{q.answer}</b>. {q.explain}</span>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button style={styles.nextBtn} onClick={handleNext} className="next-btn">
          {qIdx + 1 >= questions.length ? "See results →" : "Next question →"}
        </button>
      )}

      <div style={styles.footer}>
        Q{qIdx + 1} of {questions.length} · {hard ? "Hard — streak bonus active" : `3 correct in a row → Hard Mode`}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: COLORS.bg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "2rem 1rem",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  header: {
    width: "100%",
    maxWidth: 540,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.textPrimary,
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
  },
  scoreCluster: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  scorePill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: "6px 14px",
    gap: 2,
    minWidth: 56,
  },
  dotsRow: {
    display: "flex",
    gap: 6,
    alignItems: "center",
    marginBottom: "1rem",
    width: "100%",
    maxWidth: 540,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    transition: "all 0.3s",
  },
  timerWrap: {
    width: "100%",
    maxWidth: 540,
    height: 3,
    background: COLORS.border,
    borderRadius: 2,
    marginBottom: "1rem",
    overflow: "hidden",
  },
  timerBar: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.06s linear, background 0.3s",
  },
  hintRow: {
    width: "100%",
    maxWidth: 540,
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: "0.75rem",
    flexWrap: "wrap",
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    border: "1px solid",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
    fontFamily: "'DM Mono', monospace",
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: "italic",
    flex: 1,
  },
  canvasCard: {
    width: "100%",
    maxWidth: 540,
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "14px 16px 12px",
    marginBottom: "1rem",
    boxShadow: `0 0 40px ${COLORS.accent}11`,
  },
  canvasLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
    marginBottom: 8,
  },
  optGrid: {
    width: "100%",
    maxWidth: 540,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginBottom: "0.75rem",
  },
  optBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.15s",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.01em",
  },
  optCheck: {
    width: 16,
    fontSize: 13,
    fontWeight: 700,
  },
  feedbackBox: {
    width: "100%",
    maxWidth: 540,
    borderRadius: 12,
    border: "1px solid",
    padding: "12px 16px",
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: "0.75rem",
  },
  nextBtn: {
    width: "100%",
    maxWidth: 540,
    padding: "13px",
    borderRadius: 12,
    background: COLORS.accent,
    border: "none",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.01em",
    fontFamily: "'Space Grotesk', sans-serif",
    boxShadow: `0 0 20px ${COLORS.accent}55`,
    marginBottom: "0.75rem",
  },
  footer: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    marginTop: 8,
  },
  endCard: {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 20,
    padding: "3rem 2.5rem",
    textAlign: "center",
    width: "100%",
    maxWidth: 400,
    boxShadow: `0 0 60px ${COLORS.accent}22`,
  },
  endTitle: {
    fontSize: 48,
    fontWeight: 800,
    color: COLORS.textPrimary,
    letterSpacing: "-0.04em",
    marginBottom: 8,
  },
  endSub: {
    fontSize: 18,
    color: COLORS.accent,
    fontWeight: 600,
    marginBottom: 6,
  },
  endMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: "2rem",
    fontFamily: "'DM Mono', monospace",
  },
  restartBtn: {
    padding: "12px 32px",
    borderRadius: 12,
    background: COLORS.accent,
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    boxShadow: `0 0 24px ${COLORS.accent}55`,
  },
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .opt-btn:hover:not(:disabled) {
    background: #222230 !important;
    border-color: #6c63ff !important;
    transform: translateY(-1px);
  }
  .opt-btn:active:not(:disabled) { transform: scale(0.98); }
  .next-btn:hover { opacity: 0.88; transform: translateY(-1px); }
  .next-btn:active { transform: scale(0.98); }
`;