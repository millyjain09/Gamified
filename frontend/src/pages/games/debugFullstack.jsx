import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GOOGLE FONTS injected once ─────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("dq-fonts")) return;
  const l = document.createElement("link");
  l.id = "dq-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&family=Rajdhani:wght@500;600;700&display=swap";
  document.head.appendChild(l);
};

/* ─── GLOBAL STYLES injected once ────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("dq-styles")) return;
  const s = document.createElement("style");
  s.id = "dq-styles";
  s.textContent = `
    .dq-root *{box-sizing:border-box;margin:0;padding:0;}
    .dq-root{
      --void:#050810;--deep:#0a0f1e;--card:#0d1428;--surface:#111827;
      --cyan:#00f5ff;--purple:#a855f7;--green:#4ade80;--amber:#f59e0b;--red:#f43f5e;
      --txt:#e2e8f0;--muted:#64748b;--border:#1e2d4a;
      --f-display:'Orbitron',monospace;--f-mono:'JetBrains Mono',monospace;--f-body:'Rajdhani',sans-serif;
      font-family:var(--f-body);color:var(--txt);background:var(--void);
      min-height:100vh;position:relative;overflow-x:hidden;
    }
    .dq-root ::-webkit-scrollbar{width:5px;}
    .dq-root ::-webkit-scrollbar-track{background:var(--deep);}
    .dq-root ::-webkit-scrollbar-thumb{background:var(--cyan);border-radius:3px;}

    /* grid bg */
    .dq-grid{
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image:linear-gradient(rgba(0,245,255,.03) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,245,255,.03) 1px,transparent 1px);
      background-size:48px 48px;
    }

    /* card */
    .dq-card{
      background:var(--card);border:1px solid var(--border);border-radius:12px;
      position:relative;overflow:hidden;
    }
    .dq-card::before{
      content:'';position:absolute;inset:0;pointer-events:none;
      background:linear-gradient(135deg,rgba(0,245,255,.03) 0%,transparent 55%);
    }

    /* buttons */
    .dq-btn{
      font-family:var(--f-display);font-weight:700;letter-spacing:2px;
      text-transform:uppercase;cursor:pointer;border-radius:6px;
      transition:all .2s;position:relative;overflow:hidden;
      padding:11px 26px;font-size:.78rem;
    }
    .dq-btn-cyan{background:transparent;color:var(--cyan);border:2px solid var(--cyan);}
    .dq-btn-cyan:hover{background:var(--cyan);color:var(--void);box-shadow:0 0 28px var(--cyan);}
    .dq-btn-green{background:transparent;color:var(--green);border:2px solid var(--green);}
    .dq-btn-green:hover{background:var(--green);color:var(--void);box-shadow:0 0 28px var(--green);}
    .dq-btn-red{background:transparent;color:var(--red);border:2px solid var(--red);}
    .dq-btn-red:hover{background:var(--red);color:#fff;box-shadow:0 0 28px var(--red);}
    .dq-btn-ghost{
      background:transparent;color:var(--muted);border:1px solid var(--border);
      font-family:var(--f-mono);font-size:.7rem;letter-spacing:1px;
      padding:6px 14px;border-radius:4px;cursor:pointer;transition:all .2s;
    }
    .dq-btn-ghost:hover{border-color:var(--cyan);color:var(--cyan);}

    /* xp bar */
    .dq-xpbar{height:5px;background:var(--border);border-radius:3px;overflow:hidden;}
    .dq-xpfill{
      height:100%;border-radius:3px;transition:width .8s ease;
      background:linear-gradient(90deg,var(--cyan),var(--purple));
      box-shadow:0 0 8px var(--cyan);
    }

    /* code textarea */
    .dq-editor{
      width:100%;background:rgba(0,0,0,.75);border:1px solid var(--border);
      border-radius:0 0 10px 10px;padding:18px;color:#e2e8f0;
      font-family:var(--f-mono);font-size:.82rem;line-height:1.75;
      resize:vertical;outline:none;transition:border-color .2s;min-height:400px;
      tab-size:2;
    }
    .dq-editor:focus{border-color:rgba(0,245,255,.45);}

    /* animations */
    @keyframes dq-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes dq-slidein{from{transform:translateY(22px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes dq-flicker{0%,91%,95%,100%{opacity:1}93%{opacity:.7}94%{opacity:.9}96%{opacity:.6}}
    @keyframes dq-particle{
      0%{transform:translateY(0) rotate(0deg);opacity:0}
      10%{opacity:.9}90%{opacity:.9}
      100%{transform:translateY(-110vh) rotate(540deg);opacity:0}
    }
    @keyframes dq-toast{from{transform:translateX(-50%) translateY(-12px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
    @keyframes dq-pulse{0%,100%{box-shadow:0 0 8px var(--cyan)}50%{box-shadow:0 0 28px var(--cyan),0 0 55px var(--cyan)}}

    .dq-float{animation:dq-float 3s ease-in-out infinite;}
    .dq-slidein{animation:dq-slidein .45s ease both;}
    .dq-flicker{animation:dq-flicker 6s infinite;}
  `;
  document.head.appendChild(s);
};

/* ─── CHALLENGE DATA ──────────────────────────────────────────────────────── */
const CHALLENGES = [
  {
    id:"c1", icon:"🟨", title:"The Undefined Phantom",
    category:"JavaScript", difficulty:"ROOKIE", diffColor:"#4ade80",
    xp:100, baseScore:200,
    story:"A ghost haunts this cart calculator — values vanish into the void. Hunt it down!",
    buggyCode:
`function calculateCart(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].qty;
  }
  return totall;
}

const cart = [{price:29,qty:2},{price:15,qty:1}];
console.log(calculateCart(cart));`,
    fixedCode:
`function calculateCart(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].qty;
  }
  return total;
}

const cart = [{price:29,qty:2},{price:15,qty:1}];
console.log(calculateCart(cart));`,
    bugs:["Off-by-one: i <= items.length causes undefined access","Typo: totall → total"],
    hints:[
      "Loop condition: should it be < or <=? What happens at index items.length?",
      "Look at the return statement — is the variable name exactly right?",
      "Fix: i < items.length AND return total (one l, not two)",
    ],
    explanation:"Off-by-one error (i <= length reads items[length] which is undefined) + typo in return variable name.",
  },
  {
    id:"c2", icon:"🟩", title:"The Async Abyss",
    category:"Node.js / Express", difficulty:"APPRENTICE", diffColor:"#60a5fa",
    xp:260, baseScore:420,
    story:"This API route plunges into darkness — promises broken, data lost in the void.",
    buggyCode:
`// Express route
app.get('/users/:id', (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  user.save();
  res.status(201).json(user);
});`,
    fixedCode:
`// Express route
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});`,
    bugs:["GET route missing async/await — returns a Promise object, not data","No try/catch on either route","POST route doesn't await user.save()"],
    hints:[
      "Mongoose methods return Promises. Without await, user is a Promise, not actual data.",
      "Both routes need try/catch to handle database errors gracefully.",
      "In POST: user.save() must be awaited or the response sends before saving completes.",
    ],
    explanation:"Mongoose is async. Missing async/await means you work with Promise objects. Missing try/catch means unhandled rejections crash the server.",
  },
  {
    id:"c3", icon:"🔵", title:"The Hook Haunting",
    category:"React", difficulty:"APPRENTICE", diffColor:"#60a5fa",
    xp:310, baseScore:500,
    story:"This component is possessed — infinite re-renders, stale state spirits, and phantom keys!",
    buggyCode:
`import { useState, useEffect } from 'react';

function UserList({ teamId }) {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  // Fetches on every render — infinite loop!
  useEffect(() => {
    fetch(\`/api/teams/\${teamId}/users\`)
      .then(r => r.json())
      .then(setUsers);
  });

  // Stale closure: both calls read same snapshot
  const addTwo = () => {
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={addTwo}>Count: {count}</button>
      {users.map(u => (
        <div>{u.name}</div>
      ))}
    </div>
  );
}`,
    fixedCode:
`import { useState, useEffect } from 'react';

function UserList({ teamId }) {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  // Dependency array prevents infinite loop
  useEffect(() => {
    fetch(\`/api/teams/\${teamId}/users\`)
      .then(r => r.json())
      .then(setUsers);
  }, [teamId]);

  // Functional update avoids stale closure
  const addTwo = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <button onClick={addTwo}>Count: {count}</button>
      {users.map(u => (
        <div key={u.id}>{u.name}</div>
      ))}
    </div>
  );
}`,
    bugs:["useEffect missing dependency array → infinite fetch loop","setCount uses stale closure, not functional update","List items missing key prop → React reconciliation errors"],
    hints:[
      "useEffect without [] runs after every render. Add [teamId] to run only when teamId changes.",
      "setCount(count+1) twice reads the same count. Use setCount(prev => prev+1) instead.",
      "Every .map() rendered element needs a unique key prop for React to track them.",
    ],
    explanation:"The three most common React bugs: missing dependency array, stale closures in state updates, and missing key props in lists.",
  },
  {
    id:"c4", icon:"🟫", title:"The Schema Specter",
    category:"MongoDB", difficulty:"WARRIOR", diffColor:"#f59e0b",
    xp:510, baseScore:800,
    story:"The database schema is cursed — wrong types, broken refs, no validation. Purify it!",
    buggyCode:
`const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,          // Missing required + unique
  password: String,       // Missing required + minlength
  role: String,           // Missing enum validation
  age: String,            // Wrong type!
});

const PostSchema = new mongoose.Schema({
  title: String,
  author: String,         // Should ref User via ObjectId
  tags: String,           // Should be an array
  publishedAt: String,    // Should be Date
});

const CommentSchema = new mongoose.Schema({
  postId: mongoose.Schema.Types.ObjectId,
  body: String,
  likes: String,          // Wrong type, needs default
  // Missing: index on postId for query perf
});`,
    fixedCode:
`const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user','admin','mod'], default: 'user' },
  age: { type: Number, min: 0, max: 150 },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
  body: { type: String, required: true },
  likes: { type: Number, default: 0 },
});`,
    bugs:["Email missing required+unique → allows duplicates","author is String instead of ObjectId ref","tags is String instead of Array","age/publishedAt/likes have wrong types","Missing index on postId → slow queries"],
    hints:[
      "Email needs { required: true, unique: true } or users can register multiple times with same email.",
      "author should be { type: mongoose.Schema.Types.ObjectId, ref: 'User' } to enable .populate().",
      "tags should be [{ type: String }] (array). likes and age need Number type, not String.",
    ],
    explanation:"Schema design is your first line of defense. Wrong types silently store bad data; missing indexes make queries crawl; bad refs break population.",
  },
  {
    id:"c5", icon:"🔴", title:"The JWT Dark Ritual",
    category:"Auth / Security", difficulty:"LEGEND", diffColor:"#f43f5e",
    xp:820, baseScore:1200,
    story:"Three critical security vulnerabilities lurk in this auth system. One exploit and the kingdom falls.",
    buggyCode:
`const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// BUG 1: Hardcoded secret, no expiry
const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, 'secret123');

// BUG 2: Plain text password comparison
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user.password === password) {
    return res.json({ token: makeToken(user) });
  }
  res.status(401).json({ error: 'Bad credentials' });
};

// BUG 3: jwt.decode skips signature verification!
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.decode(token);
  req.user = decoded;
  next();
};`,
    fixedCode:
`const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// FIXED: env secret + expiry
const makeToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// FIXED: bcrypt.compare for timing-safe comparison
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ error: 'Bad credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (ok) {
    return res.json({ token: makeToken(user) });
  }
  res.status(401).json({ error: 'Bad credentials' });
};

// FIXED: jwt.verify checks signature + expiry
const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};`,
    bugs:["Hardcoded JWT secret + no expiry → tokens live forever and are easy to forge","Plain === comparison instead of bcrypt.compare → timing attack vulnerability","jwt.decode() does NOT verify signature → forged tokens pass through"],
    hints:[
      "Never hardcode secrets. Use process.env.JWT_SECRET and always set expiresIn.",
      "== comparison leaks password length via timing. bcrypt.compare() is timing-safe.",
      "jwt.decode() only base64-decodes. jwt.verify() actually checks the signature. HUGE difference.",
    ],
    explanation:"Three catastrophic auth bugs: hardcoded secret lets anyone forge tokens; plain comparison is a timing attack; jwt.decode() completely bypasses security — anyone can craft a valid-looking token.",
  },
];

const DIFF_CFG = {
  ROOKIE:     { color:"#4ade80", glow:"0 0 16px #4ade8055" },
  APPRENTICE: { color:"#60a5fa", glow:"0 0 16px #60a5fa55" },
  WARRIOR:    { color:"#f59e0b", glow:"0 0 16px #f59e0b55" },
  LEGEND:     { color:"#f43f5e", glow:"0 0 16px #f43f5e55" },
};
const AVATARS = ["🧙","🦊","🐉","🤖","👾","🦄","🐺","🦅"];

/* ─── SIMILARITY (Levenshtein-based) ─────────────────────────────────────── */
function similarity(a, b) {
  const norm = s => s.replace(/\s+/g," ").replace(/\/\/.*/g,"").trim();
  const A = norm(a), B = norm(b);
  if (!A.length || !B.length) return 0;
  const longer = A.length > B.length ? A : B;
  const shorter = A.length > B.length ? B : A;
  let prev = Array.from({length:shorter.length+1},(_,i)=>i);
  for (let i=1;i<=longer.length;i++){
    const cur=[i];
    for(let j=1;j<=shorter.length;j++){
      cur[j]=longer[i-1]===shorter[j-1]
        ?prev[j-1]
        :Math.min(prev[j-1]+1,cur[j-1]+1,prev[j]+1);
    }
    prev=cur;
  }
  return (longer.length-prev[shorter.length])/longer.length;
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
export default function DebugFullstack() {
  useEffect(()=>{ injectFonts(); injectStyles(); },[]);

  const [screen, setScreen] = useState("login"); // login | hub | intro | arena | win
  const [player, setPlayer]   = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar]   = useState("🧙");
  const [loginErr, setLoginErr] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [tab, setTab]         = useState("challenges");

  // Arena state
  const [code, setCode]       = useState("");
  const [timer, setTimer]     = useState(0);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintIdx, setHintIdx] = useState(0);
  const [showDiff, setShowDiff] = useState(false);
  const [toast, setToast]     = useState(null);
  const [particles, setParticles] = useState([]);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const timerRef = useRef(null);

  /* player helpers */
  const initPlayer = (name, av) => ({
    username:name, avatar:av, xp:0, level:1, streak:0,
    totalScore:0, solved:[], badges:[],
  });

  const xpForLevel = lvl => lvl * 500;
  const xpInLevel  = p => p.xp % 500;

  const toast$ = (msg, color="var(--cyan)") => {
    setToast({msg,color});
    setTimeout(()=>setToast(null), 2800);
  };

  const celebrate = useCallback(()=>{
    const chars=["✓","★","⚡","💎","🎉","🔥"];
    const colors=["#00f5ff","#a855f7","#4ade80","#f59e0b","#f43f5e"];
    setParticles(Array.from({length:28},(_,i)=>({
      id:i, left:Math.random()*100,
      color:colors[i%colors.length],
      char:chars[i%chars.length],
      delay:Math.random()*.8,
      dur:1.4+Math.random()*.8,
    })));
    setTimeout(()=>setParticles([]),3000);
  },[]);

  /* login */
  const handleLogin = () => {
    if(username.trim().length < 2){ setLoginErr("At least 2 characters"); return; }
    setLoginErr("");
    setPlayer(initPlayer(username.trim(), avatar));
    setScreen("hub");
  };

  /* select challenge */
  const selectChallenge = ch => {
    setChallenge(ch);
    setCode(ch.buggyCode);
    setTimer(0); setHintsUsed(0); setHintIdx(0);
    setShowDiff(false); setHintsOpen(false);
    setScreen("intro");
  };

  /* start arena */
  const startArena = () => {
    setScreen("arena");
    timerRef.current = setInterval(()=>setTimer(t=>t+1),1000);
  };

  /* exit to hub */
  const exitToHub = () => {
    clearInterval(timerRef.current);
    setScreen("hub");
  };

  /* submit */
  const handleSubmit = () => {
    const sim = similarity(code, challenge.fixedCode);
    if(sim > 0.74){
      clearInterval(timerRef.current);
      const timePen = Math.max(0,timer-30)*2;
      const hintPen = hintsUsed*50;
      const earned  = Math.max(40, Math.round(challenge.baseScore - timePen - hintPen));
      const xp      = Math.round(challenge.xp * sim);
      setScoreEarned(earned); setXpEarned(xp);

      setPlayer(prev=>{
        if(prev.solved.includes(challenge.id)) return prev;
        const newXp     = prev.xp + xp;
        const newScore  = prev.totalScore + earned;
        const newSolved = [...prev.solved, challenge.id];
        const newStreak = prev.streak + 1;
        const newLevel  = Math.floor(newXp/500)+1;
        const badges    = [...prev.badges];
        if(newSolved.length===1) badges.push("First Blood 🩸");
        if(newStreak>=3 && !badges.includes("On Fire 🔥")) badges.push("On Fire 🔥");
        if(timer<30 && !badges.includes("Speed Demon 💨")) badges.push("Speed Demon 💨");
        if(hintsUsed===0 && !badges.includes("No Hints 🧠")) badges.push("No Hints 🧠");
        return { ...prev, xp:newXp, totalScore:newScore, solved:newSolved,
                 streak:newStreak, level:newLevel, badges };
      });
      celebrate();
      setScreen("win");
    } else {
      toast$("⚠ Still buggy — keep hunting!", "var(--red)");
    }
  };

  const revealHint = () => {
    if(hintIdx < challenge.hints.length){
      setHintIdx(h=>h+1);
      setHintsUsed(h=>h+1);
      toast$(`💡 Hint ${hintIdx+1} revealed  (−50 pts)`, "var(--amber)");
    } else {
      toast$("No more hints!", "var(--muted)");
    }
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  /* ── RENDER ── */
  return (
    <div className="dq-root" style={{position:"relative"}}>
      <div className="dq-grid"/>

      {/* Particles */}
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"fixed", left:`${p.left}%`, bottom:"-10px",
          fontSize:"1.4rem", color:p.color, pointerEvents:"none", zIndex:999,
          animation:`dq-particle ${p.dur}s ${p.delay}s ease-out forwards`,
        }}>{p.char}</div>
      ))}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:"72px", left:"50%",
          transform:"translateX(-50%)",
          background:"rgba(5,8,16,.97)", border:`1px solid ${toast.color}`,
          borderRadius:"8px", padding:"11px 28px",
          fontFamily:"var(--f-mono)", fontSize:".82rem", color:toast.color,
          boxShadow:`0 0 28px ${toast.color}44`, zIndex:300,
          animation:"dq-toast .3s ease both",
        }}>{toast.msg}</div>
      )}

      {/* ── LOGIN ─────────────────────────────────────────────────────────── */}
      {screen==="login" && (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",position:"relative",zIndex:1}}>
          {/* ambient glow */}
          <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            width:"500px",height:"500px",borderRadius:"50%",pointerEvents:"none",
            background:"radial-gradient(circle,rgba(0,245,255,.06) 0%,transparent 70%)"}}/>

          <div className="dq-card dq-slidein" style={{width:"460px",padding:"48px",
            border:"1px solid rgba(0,245,255,.28)",
            boxShadow:"0 0 60px rgba(0,245,255,.08),inset 0 0 60px rgba(0,0,0,.4)"}}>

            {/* corner brackets */}
            {[["tl","2px 0 0 2px","12px","auto","12px","auto"],
              ["tr","2px 2px 0 0","12px","auto","auto","12px"],
              ["bl","0 0 2px 2px","auto","12px","12px","auto"],
              ["br","0 2px 2px 0","auto","12px","auto","12px"]].map(([k,bw,t,b,l,r])=>(
              <div key={k} style={{position:"absolute",width:"18px",height:"18px",
                borderColor:"var(--cyan)",borderStyle:"solid",borderWidth:bw,
                top:t,bottom:b,left:l,right:r}}/>
            ))}

            <div style={{textAlign:"center",marginBottom:"36px"}}>
              <div style={{fontSize:"3rem",display:"inline-block"}} className="dq-float">🐛</div>
              <h1 style={{fontFamily:"var(--f-display)",fontSize:"2rem",fontWeight:900,
                letterSpacing:"4px",color:"var(--cyan)",
                textShadow:"0 0 12px var(--cyan),0 0 32px var(--cyan)"}}
                className="dq-flicker">
                DEBUG<span style={{color:"var(--purple)",textShadow:"0 0 12px var(--purple)"}}>QUEST</span>
              </h1>
              <p style={{fontFamily:"var(--f-mono)",fontSize:".65rem",color:"var(--muted)",letterSpacing:"3px",marginTop:"8px"}}>
                &gt; FULL STACK BUG HUNTING ARENA
              </p>
            </div>

            {/* avatar */}
            <label style={{fontFamily:"var(--f-display)",fontSize:".6rem",letterSpacing:"3px",
              color:"var(--muted)",display:"block",marginBottom:"10px"}}>
              PICK YOUR WARRIOR
            </label>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
              {AVATARS.map(av=>(
                <button key={av} onClick={()=>setAvatar(av)} style={{
                  fontSize:"1.7rem",background:avatar===av?"rgba(0,245,255,.12)":"transparent",
                  border:`2px solid ${avatar===av?"var(--cyan)":"var(--border)"}`,
                  borderRadius:"8px",width:"50px",height:"50px",cursor:"pointer",
                  transition:"all .2s",
                  boxShadow:avatar===av?"0 0 14px rgba(0,245,255,.4)":"none",
                  transform:avatar===av?"scale(1.1)":"scale(1)",
                }}>{av}</button>
              ))}
            </div>

            {/* username */}
            <label style={{fontFamily:"var(--f-display)",fontSize:".6rem",letterSpacing:"3px",
              color:"var(--muted)",display:"block",marginBottom:"10px"}}>
              ENTER CODENAME
            </label>
            <input value={username} onChange={e=>setUsername(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="your_handle_here"
              style={{width:"100%",background:"rgba(0,0,0,.55)",border:"1px solid rgba(0,245,255,.28)",
                borderRadius:"6px",padding:"13px 16px",color:"var(--cyan)",
                fontFamily:"var(--f-mono)",fontSize:"1rem",outline:"none",marginBottom:"8px"}}
            />
            {loginErr && <p style={{color:"var(--red)",fontFamily:"var(--f-mono)",fontSize:".72rem",marginBottom:"12px"}}>⚠ {loginErr}</p>}

            <button className="dq-btn dq-btn-cyan" onClick={handleLogin}
              style={{width:"100%",marginTop:"12px",fontSize:".9rem",padding:"15px"}}>
              ⚔ ENTER THE ARENA
            </button>
            <p style={{textAlign:"center",fontFamily:"var(--f-mono)",fontSize:".6rem",
              color:"var(--muted)",marginTop:"20px",letterSpacing:"1px"}}>
              5 CHALLENGES · XP · BADGES · LEADERBOARD
            </p>
          </div>
        </div>
      )}

      {/* ── HUB ───────────────────────────────────────────────────────────── */}
      {screen==="hub" && player && (
        <div style={{position:"relative",zIndex:1}}>
          {/* header */}
          <header style={{borderBottom:"1px solid var(--border)",background:"rgba(5,8,16,.92)",
            backdropFilter:"blur(18px)",position:"sticky",top:0,zIndex:100}}>
            <div style={{maxWidth:"1180px",margin:"0 auto",padding:"0 24px",
              height:"60px",display:"flex",alignItems:"center",gap:"20px"}}>
              <span style={{fontFamily:"var(--f-display)",fontSize:".9rem",fontWeight:900,
                letterSpacing:"3px",color:"var(--cyan)",
                textShadow:"0 0 10px var(--cyan)"}}>
                🐛 DEBUG<span style={{color:"var(--purple)"}}>QUEST</span>
              </span>
              <div style={{flex:1}}/>
              {/* streak */}
              <span style={{fontFamily:"var(--f-display)",fontSize:".75rem",color:"var(--amber)"}}>
                🔥 {player.streak}
              </span>
              {/* level + xp */}
              <div style={{minWidth:"130px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                  <span style={{fontFamily:"var(--f-display)",fontSize:".55rem",letterSpacing:"2px",color:"var(--purple)"}}>LVL {player.level}</span>
                  <span style={{fontFamily:"var(--f-mono)",fontSize:".55rem",color:"var(--muted)"}}>
                    {xpInLevel(player)}/{xpForLevel(player.level)}
                  </span>
                </div>
                <div className="dq-xpbar">
                  <div className="dq-xpfill" style={{width:`${(xpInLevel(player)/xpForLevel(player.level))*100}%`}}/>
                </div>
              </div>
              <span style={{fontSize:"1.4rem"}}>{player.avatar}</span>
              <span style={{fontFamily:"var(--f-display)",fontSize:".72rem",letterSpacing:"1px"}}>{player.username}</span>
              <button className="dq-btn-ghost" onClick={()=>setScreen("login")} style={{fontFamily:"var(--f-mono)"}}>EXIT</button>
            </div>
          </header>

          <div style={{maxWidth:"1180px",margin:"0 auto",padding:"32px 24px"}}>
            {/* hero */}
            <div style={{padding:"36px 40px",marginBottom:"36px",borderRadius:"14px",
              background:"linear-gradient(135deg,rgba(0,245,255,.05),rgba(168,85,247,.05))",
              border:"1px solid rgba(0,245,255,.14)",
              display:"flex",alignItems:"center",justifyContent:"space-between",gap:"24px",flexWrap:"wrap"}}>
              <div>
                <p style={{fontFamily:"var(--f-mono)",fontSize:".62rem",letterSpacing:"3px",color:"var(--muted)",marginBottom:"8px"}}>
                  &gt; WELCOME BACK, {player.username.toUpperCase()}
                </p>
                <h1 style={{fontFamily:"var(--f-display)",fontSize:"1.9rem",fontWeight:900,
                  letterSpacing:"2px",lineHeight:1.25,marginBottom:"18px"}}>
                  HUNT THE <span style={{color:"var(--cyan)",textShadow:"0 0 18px var(--cyan)"}}>BUG</span>.<br/>
                  EARN THE <span style={{color:"var(--purple)",textShadow:"0 0 18px var(--purple)"}}>GLORY</span>.
                </h1>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  {player.badges.length===0
                    ? <span style={{fontFamily:"var(--f-mono)",fontSize:".68rem",color:"var(--muted)"}}>Solve a challenge to earn badges!</span>
                    : player.badges.map((b,i)=>(
                      <span key={i} style={{background:"rgba(168,85,247,.14)",border:"1px solid rgba(168,85,247,.4)",
                        borderRadius:"20px",padding:"3px 14px",fontSize:".78rem",color:"var(--purple)"}}>
                        {b}
                      </span>
                    ))
                  }
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
                {[
                  {l:"SCORE", v:player.totalScore.toLocaleString(), c:"var(--cyan)"},
                  {l:"SOLVED", v:`${player.solved.length}/${CHALLENGES.length}`, c:"var(--green)"},
                  {l:"LEVEL", v:player.level, c:"var(--purple)"},
                  {l:"STREAK", v:`${player.streak}🔥`, c:"var(--amber)"},
                ].map(s=>(
                  <div key={s.l} style={{background:"rgba(0,0,0,.4)",border:"1px solid var(--border)",
                    borderRadius:"10px",padding:"16px 18px",textAlign:"center"}}>
                    <div style={{fontFamily:"var(--f-display)",fontSize:"1.5rem",fontWeight:900,color:s.c}}>{s.v}</div>
                    <div style={{fontFamily:"var(--f-display)",fontSize:".5rem",letterSpacing:"2px",
                      color:"var(--muted)",marginTop:"5px"}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* tabs */}
            <div style={{display:"flex",gap:"2px",borderBottom:"1px solid var(--border)",marginBottom:"26px"}}>
              {["challenges","badges"].map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{
                  fontFamily:"var(--f-display)",fontSize:".62rem",letterSpacing:"3px",
                  padding:"11px 22px",background:"transparent",border:"none",
                  color:tab===t?"var(--cyan)":"var(--muted)",
                  borderBottom:tab===t?"2px solid var(--cyan)":"2px solid transparent",
                  cursor:"pointer",textTransform:"uppercase",marginBottom:"-1px",transition:"all .2s",
                }}>
                  {t==="challenges"?"⚔ CHALLENGES":"🏅 BADGES"}
                </button>
              ))}
            </div>

            {/* challenge cards */}
            {tab==="challenges" && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"18px"}}>
                {CHALLENGES.map((ch,i)=>{
                  const solved = player.solved.includes(ch.id);
                  const dc = DIFF_CFG[ch.difficulty];
                  return (
                    <div key={ch.id} className="dq-card" onClick={()=>selectChallenge(ch)}
                      style={{
                        padding:"26px",cursor:"pointer",
                        animation:`dq-slidein .4s ${i*.07}s both`,
                        border:solved?"1px solid rgba(74,222,128,.3)":"1px solid var(--border)",
                        transition:"all .25s",
                      }}
                      onMouseEnter={e=>{
                        e.currentTarget.style.transform="translateY(-4px)";
                        e.currentTarget.style.boxShadow=solved
                          ?"0 12px 36px rgba(74,222,128,.14)"
                          :"0 12px 36px rgba(0,245,255,.09)";
                        e.currentTarget.style.borderColor=solved?"rgba(74,222,128,.55)":"rgba(0,245,255,.32)";
                      }}
                      onMouseLeave={e=>{
                        e.currentTarget.style.transform="translateY(0)";
                        e.currentTarget.style.boxShadow="none";
                        e.currentTarget.style.borderColor=solved?"rgba(74,222,128,.3)":"var(--border)";
                      }}>
                      {solved && (
                        <div style={{position:"absolute",top:"12px",right:"12px",
                          background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.4)",
                          borderRadius:"20px",padding:"2px 12px",
                          fontFamily:"var(--f-display)",fontSize:".52rem",letterSpacing:"2px",color:"var(--green)"}}>
                          ✓ SOLVED
                        </div>
                      )}
                      <div style={{display:"flex",gap:"14px",alignItems:"flex-start",marginBottom:"14px"}}>
                        <span style={{fontSize:"2rem",lineHeight:1}}>{ch.icon}</span>
                        <div>
                          <h3 style={{fontFamily:"var(--f-display)",fontSize:".82rem",fontWeight:700,
                            letterSpacing:"1px",marginBottom:"6px",
                            color:solved?"var(--green)":"var(--txt)"}}>{ch.title}</h3>
                          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                            <span style={{fontFamily:"var(--f-display)",fontSize:".5rem",letterSpacing:"2px",
                              padding:"2px 9px",border:`1px solid ${dc.color}`,borderRadius:"3px",
                              color:dc.color,boxShadow:dc.glow}}>{ch.difficulty}</span>
                            <span style={{fontFamily:"var(--f-mono)",fontSize:".62rem",color:"var(--muted)"}}>{ch.category}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{fontFamily:"var(--f-body)",fontSize:".84rem",color:"var(--muted)",
                        lineHeight:1.55,marginBottom:"18px"}}>{ch.story}</p>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:"18px"}}>
                          {[{l:"XP",v:`+${ch.xp}`,c:"var(--purple)"},{l:"SCORE",v:ch.baseScore,c:"var(--cyan)"}].map(s=>(
                            <div key={s.l}>
                              <div style={{fontFamily:"var(--f-display)",fontSize:".95rem",fontWeight:700,color:s.c}}>{s.v}</div>
                              <div style={{fontFamily:"var(--f-display)",fontSize:".48rem",letterSpacing:"2px",color:"var(--muted)"}}>{s.l}</div>
                            </div>
                          ))}
                        </div>
                        <span style={{fontFamily:"var(--f-display)",fontSize:".65rem",letterSpacing:"2px",
                          color:solved?"var(--green)":"var(--cyan)"}}>
                          {solved?"REPLAY ↺":"DEBUG →"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* badges tab */}
            {tab==="badges" && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"16px"}}>
                {[
                  {b:"First Blood 🩸", desc:"Solve your first challenge"},
                  {b:"On Fire 🔥", desc:"3-challenge streak"},
                  {b:"Speed Demon 💨", desc:"Solve in under 30s"},
                  {b:"No Hints 🧠", desc:"Solve without hints"},
                  {b:"Bug Slayer ⚔", desc:"Solve all 5 challenges"},
                ].map(({b,desc})=>{
                  const earned = player.badges.includes(b);
                  return (
                    <div key={b} className="dq-card" style={{padding:"22px",textAlign:"center",
                      border:earned?"1px solid rgba(168,85,247,.35)":"1px solid var(--border)",
                      opacity:earned?1:.45}}>
                      <div style={{fontSize:"2.2rem",marginBottom:"10px"}}>{b.slice(-2)}</div>
                      <div style={{fontFamily:"var(--f-display)",fontSize:".7rem",letterSpacing:"1px",
                        color:earned?"var(--purple)":"var(--muted)",marginBottom:"6px"}}>{b.slice(0,-2)}</div>
                      <div style={{fontFamily:"var(--f-body)",fontSize:".75rem",color:"var(--muted)"}}>{desc}</div>
                      {earned && <div style={{marginTop:"10px",fontSize:".65rem",fontFamily:"var(--f-display)",
                        letterSpacing:"2px",color:"var(--green)"}}>✓ EARNED</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INTRO ─────────────────────────────────────────────────────────── */}
      {screen==="intro" && challenge && (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
          padding:"32px",position:"relative",zIndex:1}}>
          <div className="dq-card dq-slidein" style={{maxWidth:"600px",width:"100%",padding:"50px",
            border:"1px solid rgba(0,245,255,.2)",boxShadow:"0 0 50px rgba(0,245,255,.06)"}}>
            <div style={{textAlign:"center",marginBottom:"30px"}}>
              <div style={{fontSize:"3.5rem",display:"inline-block"}} className="dq-float">{challenge.icon}</div>
              <h1 style={{fontFamily:"var(--f-display)",fontSize:"1.5rem",fontWeight:900,
                letterSpacing:"2px",marginBottom:"10px",marginTop:"10px"}}>{challenge.title}</h1>
              <div style={{display:"inline-flex",alignItems:"center",gap:"10px",marginBottom:"14px"}}>
                <span style={{fontFamily:"var(--f-display)",fontSize:".55rem",letterSpacing:"2px",
                  padding:"3px 10px",border:`1px solid ${DIFF_CFG[challenge.difficulty].color}`,
                  borderRadius:"3px",color:DIFF_CFG[challenge.difficulty].color,
                  boxShadow:DIFF_CFG[challenge.difficulty].glow}}>{challenge.difficulty}</span>
                <span style={{fontFamily:"var(--f-mono)",fontSize:".65rem",color:"var(--muted)"}}>{challenge.category}</span>
              </div>
              <p style={{fontFamily:"var(--f-body)",fontSize:".95rem",color:"var(--muted)",lineHeight:1.65}}>{challenge.story}</p>
            </div>

            {/* bugs list */}
            <div style={{background:"rgba(244,63,94,.06)",border:"1px solid rgba(244,63,94,.25)",
              borderRadius:"10px",padding:"20px",marginBottom:"26px"}}>
              <div style={{fontFamily:"var(--f-display)",fontSize:".58rem",letterSpacing:"3px",
                color:"var(--red)",marginBottom:"12px"}}>🐛 BUGS TO FIND ({challenge.bugs.length})</div>
              {challenge.bugs.map((b,i)=>(
                <div key={i} style={{fontFamily:"var(--f-mono)",fontSize:".74rem",color:"var(--muted)",
                  padding:"6px 0",borderBottom:i<challenge.bugs.length-1?"1px solid var(--border)":"none",
                  display:"flex",gap:"8px"}}>
                  <span style={{color:"var(--red)",flexShrink:0}}>{i+1}.</span>{b}
                </div>
              ))}
            </div>

            {/* reward row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px",marginBottom:"30px"}}>
              {[{l:"BASE SCORE",v:challenge.baseScore,c:"var(--cyan)"},
                {l:"XP REWARD",v:`+${challenge.xp}`,c:"var(--purple)"},
                {l:"HINTS",v:`${challenge.hints.length} avail`,c:"var(--amber)"}].map(s=>(
                <div key={s.l} style={{background:"rgba(0,0,0,.35)",border:"1px solid var(--border)",
                  borderRadius:"8px",padding:"14px",textAlign:"center"}}>
                  <div style={{fontFamily:"var(--f-display)",fontSize:"1rem",fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontFamily:"var(--f-display)",fontSize:".5rem",letterSpacing:"2px",
                    color:"var(--muted)",marginTop:"4px"}}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:"10px"}}>
              <button className="dq-btn dq-btn-ghost" onClick={exitToHub} style={{flex:"0 0 auto"}}>← BACK</button>
              <button className="dq-btn dq-btn-cyan" onClick={startArena} style={{flex:1,fontSize:".9rem",padding:"15px"}}>
                ⚔ BEGIN THE HUNT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ARENA ─────────────────────────────────────────────────────────── */}
      {screen==="arena" && challenge && (
        <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",position:"relative",zIndex:1}}>
          {/* arena header */}
          <header style={{borderBottom:"1px solid var(--border)",background:"rgba(5,8,16,.94)",
            backdropFilter:"blur(18px)",position:"sticky",top:0,zIndex:100,padding:"0 22px"}}>
            <div style={{maxWidth:"1380px",margin:"0 auto",height:"58px",
              display:"flex",alignItems:"center",gap:"18px"}}>
              <button className="dq-btn-ghost" onClick={exitToHub} style={{fontFamily:"var(--f-mono)"}}>← EXIT</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"var(--f-display)",fontSize:".8rem",fontWeight:700,letterSpacing:"1px"}}>{challenge.title}</div>
                <div style={{display:"flex",gap:"8px",marginTop:"2px"}}>
                  <span style={{fontFamily:"var(--f-display)",fontSize:".5rem",letterSpacing:"2px",
                    padding:"1px 8px",border:`1px solid ${DIFF_CFG[challenge.difficulty].color}`,
                    borderRadius:"3px",color:DIFF_CFG[challenge.difficulty].color}}>{challenge.difficulty}</span>
                  <span style={{fontFamily:"var(--f-mono)",fontSize:".6rem",color:"var(--muted)"}}>{challenge.category}</span>
                </div>
              </div>
              <div style={{fontFamily:"var(--f-display)",fontSize:"1.2rem",fontWeight:700,letterSpacing:"3px",
                color:timer>120?"var(--red)":timer>60?"var(--amber)":"var(--green)",
                textShadow:"0 0 12px currentColor"}}>
                ⏱ {fmt(timer)}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--f-display)",fontSize:".85rem",color:"var(--purple)"}}>+{challenge.xp} XP</div>
                <div style={{fontFamily:"var(--f-display)",fontSize:".48rem",letterSpacing:"2px",color:"var(--muted)"}}>REWARD</div>
              </div>
            </div>
          </header>

          {/* main arena */}
          <div style={{flex:1,maxWidth:"1380px",margin:"0 auto",width:"100%",
            padding:"22px",display:"flex",gap:"18px",flexDirection:"column"}}>
            <div style={{display:"flex",gap:"18px",flex:1}}>
              {/* editor column */}
              <div style={{flex:1,display:"flex",flexDirection:"column"}}>
                {/* editor toolbar */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"9px 16px",background:"var(--surface)",
                  border:"1px solid var(--border)",borderBottom:"none",borderRadius:"10px 10px 0 0"}}>
                  <div style={{display:"flex",gap:"7px",alignItems:"center"}}>
                    {["#f43f5e","#f59e0b","#4ade80"].map(c=>(
                      <div key={c} style={{width:"9px",height:"9px",borderRadius:"50%",background:c}}/>
                    ))}
                    <span style={{fontFamily:"var(--f-mono)",fontSize:".68rem",color:"var(--muted)",marginLeft:"8px"}}>
                      buggy.{challenge.category==="React"?"jsx":"js"}
                    </span>
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button className="dq-btn-ghost" onClick={()=>setCode(challenge.buggyCode)} style={{fontSize:".62rem",padding:"4px 12px"}}>RESET</button>
                    <button className="dq-btn-ghost" onClick={()=>setShowDiff(d=>!d)}
                      style={{fontSize:".62rem",padding:"4px 12px",
                        borderColor:showDiff?"var(--purple)":"var(--border)",
                        color:showDiff?"var(--purple)":"var(--muted)"}}>
                      DIFF VIEW
                    </button>
                  </div>
                </div>

                {!showDiff
                  ? <textarea className="dq-editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/>
                  : (
                    <div style={{flex:1,minHeight:"400px",display:"grid",gridTemplateColumns:"1fr 1fr",
                      background:"rgba(0,0,0,.75)",border:"1px solid var(--border)",borderRadius:"0 0 10px 10px",overflow:"auto"}}>
                      {[{label:"🐛 BUGGY",src:challenge.buggyCode,bg:"rgba(244,63,94,.07)",c:"#fca5a5",bc:"rgba(244,63,94,.2)"},
                        {label:"✓ FIXED",src:challenge.fixedCode,bg:"rgba(74,222,128,.06)",c:"#86efac",bc:"rgba(74,222,128,.18)"}].map(col=>(
                        <div key={col.label} style={{borderRight:col.label.startsWith("🐛")?"1px solid var(--border)":"none"}}>
                          <div style={{padding:"8px 16px",background:col.bg,borderBottom:`1px solid ${col.bc}`,
                            fontFamily:"var(--f-display)",fontSize:".58rem",letterSpacing:"2px",color:col.c}}>{col.label}</div>
                          <pre style={{padding:"14px",fontFamily:"var(--f-mono)",fontSize:".76rem",
                            color:col.c,lineHeight:1.7,margin:0,overflow:"auto",whiteSpace:"pre-wrap"}}>
                            {col.src.split("\n").map((line,i)=>(
                              <div key={i} style={{
                                background:challenge.buggyCode.split("\n")[i]!==challenge.fixedCode.split("\n")[i]
                                  ? col.bg : "transparent",
                                padding:"1px 4px",borderRadius:"2px",
                              }}>{line||" "}</div>
                            ))}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* side panel */}
              <div style={{width:"290px",display:"flex",flexDirection:"column",gap:"14px"}}>
                {/* bugs */}
                <div className="dq-card" style={{padding:"18px"}}>
                  <div style={{fontFamily:"var(--f-display)",fontSize:".57rem",letterSpacing:"3px",
                    color:"var(--red)",marginBottom:"11px"}}>🐛 HUNT LIST</div>
                  {challenge.bugs.map((b,i)=>(
                    <div key={i} style={{fontFamily:"var(--f-mono)",fontSize:".7rem",color:"var(--muted)",
                      padding:"7px 0",borderBottom:i<challenge.bugs.length-1?"1px solid var(--border)":"none",
                      display:"flex",gap:"7px",alignItems:"flex-start",lineHeight:1.4}}>
                      <span style={{color:"var(--red)",flexShrink:0}}>▸</span>{b}
                    </div>
                  ))}
                </div>

                {/* hints */}
                <div className="dq-card" style={{padding:"18px"}}>
                  <div style={{fontFamily:"var(--f-display)",fontSize:".57rem",letterSpacing:"3px",
                    color:"var(--amber)",marginBottom:"11px"}}>
                    💡 HINTS ({hintsUsed}/{challenge.hints.length} used)
                  </div>
                  {challenge.hints.slice(0,hintIdx).map((h,i)=>(
                    <div key={i} style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.22)",
                      borderRadius:"6px",padding:"9px 12px",marginBottom:"8px",
                      fontFamily:"var(--f-body)",fontSize:".78rem",color:"var(--amber)",lineHeight:1.5}}>
                      <span style={{opacity:.5,marginRight:"6px"}}>#{i+1}</span>{h}
                    </div>
                  ))}
                  {hintIdx < challenge.hints.length && (
                    <button onClick={revealHint} style={{
                      width:"100%",background:"transparent",
                      border:"1px dashed rgba(245,158,11,.35)",color:"var(--amber)",
                      padding:"9px",borderRadius:"6px",cursor:"pointer",
                      fontFamily:"var(--f-display)",fontSize:".58rem",letterSpacing:"2px",
                      transition:"background .2s",
                    }}
                      onMouseEnter={e=>e.target.style.background="rgba(245,158,11,.09)"}
                      onMouseLeave={e=>e.target.style.background="transparent"}
                    >REVEAL HINT (−50 pts)</button>
                  )}
                </div>

                {/* live score */}
                <div className="dq-card" style={{padding:"18px"}}>
                  <div style={{fontFamily:"var(--f-display)",fontSize:".57rem",letterSpacing:"3px",
                    color:"var(--cyan)",marginBottom:"11px"}}>📊 LIVE SCORE</div>
                  {[
                    {l:"Base", v:challenge.baseScore, c:"var(--cyan)"},
                    {l:"Time penalty", v:`-${Math.max(0,timer-30)*2}`, c:"var(--red)"},
                    {l:"Hint penalty", v:`-${hintsUsed*50}`, c:"var(--red)"},
                  ].map(r=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",
                      fontFamily:"var(--f-mono)",fontSize:".7rem",color:"var(--muted)",marginBottom:"6px"}}>
                      <span>{r.l}</span><span style={{color:r.c}}>{r.v}</span>
                    </div>
                  ))}
                  <div style={{borderTop:"1px solid var(--border)",paddingTop:"10px",marginTop:"4px",
                    display:"flex",justifyContent:"space-between",
                    fontFamily:"var(--f-display)",fontSize:".8rem"}}>
                    <span>EST.</span>
                    <span style={{color:"var(--green)"}}>
                      {Math.max(40,challenge.baseScore-Math.max(0,timer-30)*2-hintsUsed*50)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* action bar */}
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end",
              paddingTop:"18px",borderTop:"1px solid var(--border)"}}>
              <button className="dq-btn dq-btn-red" onClick={exitToHub}>ABANDON</button>
              <button className="dq-btn dq-btn-green" onClick={handleSubmit}>✓ SUBMIT FIX</button>
            </div>
          </div>
        </div>
      )}

      {/* ── WIN ───────────────────────────────────────────────────────────── */}
      {screen==="win" && challenge && player && (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
          padding:"32px",position:"relative",zIndex:1}}>
          <div className="dq-card dq-slidein" style={{maxWidth:"540px",width:"100%",padding:"52px",
            textAlign:"center",border:"1px solid rgba(74,222,128,.38)",
            boxShadow:"0 0 55px rgba(74,222,128,.12)"}}>
            <div style={{fontSize:"3.8rem",marginBottom:"14px"}} className="dq-float">🎉</div>
            <h1 style={{fontFamily:"var(--f-display)",fontSize:"1.9rem",fontWeight:900,letterSpacing:"3px",
              color:"var(--green)",textShadow:"0 0 28px var(--green)",marginBottom:"8px"}}>
              BUG SLAIN!
            </h1>
            <p style={{fontFamily:"var(--f-body)",fontSize:".95rem",color:"var(--muted)",marginBottom:"32px"}}>
              You vanquished the <strong style={{color:"var(--txt)"}}>{challenge.category}</strong> bug in <strong style={{color:"var(--cyan)"}}>{fmt(timer)}</strong>
            </p>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"14px",marginBottom:"28px"}}>
              {[{l:"SCORE",v:`+${scoreEarned}`,c:"var(--cyan)"},
                {l:"XP",v:`+${xpEarned}`,c:"var(--purple)"},
                {l:"TIME",v:fmt(timer),c:"var(--amber)"}].map(s=>(
                <div key={s.l} style={{background:"rgba(0,0,0,.4)",border:"1px solid var(--border)",
                  borderRadius:"10px",padding:"18px 10px"}}>
                  <div style={{fontFamily:"var(--f-display)",fontSize:"1.35rem",fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontFamily:"var(--f-display)",fontSize:".48rem",letterSpacing:"2px",
                    color:"var(--muted)",marginTop:"5px"}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* explanation */}
            <div style={{background:"rgba(0,0,0,.4)",border:"1px solid var(--border)",borderRadius:"10px",
              padding:"18px 20px",marginBottom:"28px",textAlign:"left"}}>
              <div style={{fontFamily:"var(--f-display)",fontSize:".57rem",letterSpacing:"3px",
                color:"var(--cyan)",marginBottom:"8px"}}>📖 LESSON</div>
              <p style={{fontFamily:"var(--f-body)",fontSize:".84rem",color:"var(--muted)",lineHeight:1.6}}>
                {challenge.explanation}
              </p>
            </div>

            <button className="dq-btn dq-btn-cyan" onClick={exitToHub} style={{width:"100%",fontSize:".9rem",padding:"15px"}}>
              ← BACK TO ARENA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}