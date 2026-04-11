import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Game configuration
const GAME_SPEED = 50;
const ENEMY_SPEED = 2;

const initialEnemies = [
  { id: 1, text: "milly@gmail.com", isBad: false, x: -100, active: true },
  { id: 2, text: "<script>alert(1)</script>", isBad: true, x: -350, active: true },
  { id: 3, text: "user_99", isBad: false, x: -600, active: true },
  { id: 4, text: "DROP TABLE users;", isBad: true, x: -850, active: true },
  { id: 5, text: "admin@company.in", isBad: false, x: -1100, active: true },
  { id: 6, text: "1=1 OR SELECT *", isBad: true, x: -1350, active: true },
];

const BrokenKingdom = () => {
  const navigate = useNavigate();

  const [enemies, setEnemies] = useState(initialEnemies);
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [regexInput, setRegexInput] = useState('');
  const [shake, setShake] = useState(false);

  // Multiplayer
  const [playerName] = useState("Player_" + Math.floor(Math.random()*1000));
  const [roomId, setRoomId] = useState(null);
  const [incomingAttack, setIncomingAttack] = useState(0);

  // Leaderboard
  const [highScore, setHighScore] = useState(
    localStorage.getItem("gg_highscore") || 0
  );

  const gameAreaRef = useRef(null);

  /* ================= MULTIPLAYER ================= */
  useEffect(() => {
    socket.emit("joinGame", playerName);

    socket.on("startGame", () => {
      setRoomId("room1");
    });

    socket.on("receiveAttack", (damage) => {
      setIncomingAttack(damage);
    });

    return () => socket.disconnect();
  }, []);

  /* ================= APPLY ATTACK ================= */
  useEffect(() => {
    if (incomingAttack > 0) {
      setHealth((h) => Math.max(0, h - incomingAttack));
      triggerShake();
    }
  }, [incomingAttack]);

  /* ================= GAME LOOP ================= */
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setEnemies((prevEnemies) => {
        let healthDamage = 0;
        let scoreGain = 0;

        const newEnemies = prevEnemies.map((enemy) => {
          if (!enemy.active) return enemy;

          const newX = enemy.x + ENEMY_SPEED;

          if (newX > 350 && newX < 400) {
            try {
              const turretRegex = new RegExp(regexInput || '^$', 'gi');

              if (turretRegex.test(enemy.text)) {
                if (enemy.isBad) {
                  scoreGain += 20;

                  // 🔥 SEND ATTACK
                  socket.emit("attack", { roomId, damage: 1 });

                } else {
                  healthDamage += 1;
                  triggerShake();
                }

                return { ...enemy, x: newX, active: false, destroyedByTurret: true };
              }
            } catch {}
          }

          if (newX > 800) {
            if (enemy.isBad) {
              healthDamage += 1;
              triggerShake();
            } else {
              scoreGain += 10;
            }

            return { ...enemy, x: newX, active: false, reachedDB: true };
          }

          return { ...enemy, x: newX };
        });

        if (healthDamage > 0) {
          setHealth((h) => Math.max(0, h - healthDamage));
        }

        if (scoreGain > 0) {
          setScore((s) => s + scoreGain);
        }

        return newEnemies;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState, regexInput, roomId]);

  /* ================= WIN/LOSS ================= */
  useEffect(() => {
    if (health <= 0) {
      setGameState('over');
    } else if (enemies.every(e => !e.active) && gameState === 'playing') {
      setGameState('won');
    }
  }, [health, enemies, gameState]);

  /* ================= LEADERBOARD ================= */
  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem("gg_highscore", score);
      setHighScore(score);
    }
  }, [score]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const startGame = () => {
    setEnemies(initialEnemies);
    setHealth(3);
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className={`min-h-screen bg-[#0d1117] p-6 font-mono text-gray-200 flex flex-col items-center justify-center transition-transform duration-75 ${shake ? 'translate-x-3 -translate-y-2' : ''}`}>
      
      <div className="w-full max-w-5xl">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 bg-[#161b22] p-4 rounded-2xl border border-gray-700 shadow-xl">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">
              Broken Kingdom
            </h1>
            <p className="text-xs text-gray-400 mt-1">Defend the Database. Destroy Malicious Payloads.</p>
            <p className="text-xs text-gray-500">
              Player: {playerName} | Room: {roomId || "Connecting..."}
            </p>
          </div>
          
          <div className="flex gap-8 items-center bg-black/50 px-6 py-2 rounded-xl border border-gray-800">
            <div className="text-xl font-bold text-green-400">XP: {score}</div>
            <div className="text-yellow-400 text-sm">🏆 {highScore}</div>
            <div className="text-2xl flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < health ? 'text-red-500' : 'text-gray-800'}>
                  ❤️
                </span>
              ))}
            </div>
            <button onClick={() => navigate('/missions/full-stack')} className="text-sm text-gray-400 hover:text-white">ABORT</button>
          </div>
        </div>

        {/* GAME AREA */}
        <div className="relative bg-[#0a0c10] border-2 border-gray-800 rounded-3xl h-[400px] overflow-hidden mb-6 flex items-center">

          {/* Turret */}
          <div className="absolute left-[380px] top-[100px] text-yellow-400 animate-pulse z-10">
            🔫
          </div>

          {/* Enemies */}
          {enemies.map((enemy) => {
            if (!enemy.active) {
              if (enemy.destroyedByTurret) {
                return (
                  <div key={enemy.id}
                    className="absolute top-1/2 -translate-y-1/2 text-2xl animate-ping"
                    style={{ left: `${enemy.x}px` }}>
                    💥
                  </div>
                );
              }
              return null;
            }

            return (
              <div key={enemy.id}
                className="absolute top-1/2 -translate-y-1/2 px-4 py-2 bg-[#1e1e1e] border rounded-lg"
                style={{ left: `${enemy.x}px` }}>
                <span className={enemy.isBad ? 'text-red-400' : 'text-green-400'}>
                  {enemy.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl border-2 border-gray-700">
          <input 
            type="text" 
            value={regexInput}
            onChange={(e) => setRegexInput(e.target.value)}
            placeholder="Enter regex"
            className="bg-black text-yellow-300 px-4 py-2 w-full"
            disabled={gameState !== 'playing'}
          />
        </div>

        {/* BUTTON */}
        {gameState === 'idle' && (
          <button onClick={startGame} className="mt-4 bg-yellow-500 px-6 py-2">
            START GAME
          </button>
        )}

      </div>
    </div>
  );
};

export default BrokenKingdom;