import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Game configuration
const GAME_SPEED = 50; // Milliseconds per frame
const ENEMY_SPEED = 2; // Pixels per frame

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
  const [gameState, setGameState] = useState('idle'); // idle, playing, over, won
  const [regexInput, setRegexInput] = useState('');
  const [shake, setShake] = useState(false);
  
  const gameAreaRef = useRef(null);

  // The Main Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setEnemies((prevEnemies) => {
        let newEnemies = [...prevEnemies];
        let healthDamage = 0;
        let scoreGain = 0;

        newEnemies = newEnemies.map((enemy) => {
          if (!enemy.active) return enemy;

          // Move enemy to the right
          const newX = enemy.x + ENEMY_SPEED;

          // Check if enemy reaches the "Turret Kill Zone" (Center of screen, approx X: 400)
          if (newX > 350 && newX < 400) {
            try {
              // Create dynamic regex from user input
              const turretRegex = new RegExp(regexInput || '^$'); 
              
              // If regex matches, the turret SHOOTS and destroys the packet
              if (turretRegex.test(enemy.text)) {
                if (enemy.isBad) {
                  scoreGain += 20; // Correctly destroyed bad data
                } else {
                  healthDamage += 1; // Oops! Destroyed good data (False Positive)
                  triggerShake();
                }
                return { ...enemy, x: newX, active: false, destroyedByTurret: true };
              }
            } catch (e) {
              // Invalid regex, turret jams
            }
          }

          // Check if enemy breaches the Database (Right edge, approx X: 800)
          if (newX > 800) {
            if (enemy.isBad) {
              healthDamage += 1; // Bad data entered DB!
              triggerShake();
            } else {
              scoreGain += 10; // Good data safely stored
            }
            return { ...enemy, x: newX, active: false, reachedDB: true };
          }

          return { ...enemy, x: newX };
        });

        // Apply health and score changes
        if (healthDamage > 0) setHealth((h) => Math.max(0, h - healthDamage));
        if (scoreGain > 0) setScore((s) => s + scoreGain);

        return newEnemies;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState, regexInput]);

  // Check Win/Loss condition
  useEffect(() => {
    if (health <= 0) {
      setGameState('over');
    } else if (enemies.every(e => !e.active) && gameState === 'playing') {
      setGameState('won');
    }
  }, [health, enemies, gameState]);

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
        
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-6 bg-[#161b22] p-4 rounded-2xl border border-gray-700 shadow-xl">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">
              Broken Kingdom
            </h1>
            <p className="text-xs text-gray-400 mt-1">Defend the Database. Destroy Malicious Payloads.</p>
          </div>
          
          <div className="flex gap-8 items-center bg-black/50 px-6 py-2 rounded-xl border border-gray-800">
            <div className="text-xl font-bold text-green-400">XP: {score}</div>
            <div className="text-2xl flex gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < health ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-gray-800'}>
                  ❤️
                </span>
              ))}
            </div>
            <button onClick={() => navigate('/missions/full-stack')} className="text-sm text-gray-400 hover:text-white">ABORT</button>
          </div>
        </div>

        {/* The Battlefield */}
        <div 
          ref={gameAreaRef}
          className="relative bg-[#0a0c10] border-2 border-gray-800 rounded-3xl h-[400px] shadow-2xl overflow-hidden mb-6 flex items-center"
        >
          {/* Overlays */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-black text-white mb-4">INCOMING DDOS ATTACK</h2>
              <p className="text-gray-400 mb-6 text-center max-w-lg">
                Write a Regex rule in the Turret below to shoot down bad data (like scripts and SQL injections). <br/>
                <span className="text-yellow-400">Do NOT shoot valid emails or usernames!</span>
              </p>
              <button onClick={startGame} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black text-xl hover:bg-yellow-400 hover:scale-105 transition-all">
                INITIALIZE DEFENSE
              </button>
            </div>
          )}

          {(gameState === 'over' || gameState === 'won') && (
            <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center">
              <h2 className={`text-6xl font-black mb-4 ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>
                {gameState === 'won' ? 'DATABASE SECURED' : 'SYSTEM COMPROMISED'}
              </h2>
              <button onClick={startGame} className="mt-6 bg-white text-black px-8 py-3 rounded-xl font-black hover:scale-105 transition-all">
                {gameState === 'won' ? 'NEXT WAVE' : 'RETRY MISSION'}
              </button>
            </div>
          )}

          {/* Background Scenery */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-20 bg-gray-900/50 border-y border-gray-800 flex items-center justify-between px-10">
            <span className="text-gray-700 font-black tracking-widest uppercase">The Void</span>
            <div className="h-full w-2 border-l-2 border-dashed border-red-500/30"></div> {/* Turret Line */}
            <span className="text-gray-700 font-black tracking-widest uppercase flex items-center gap-2">
               MongoDB 🗄️
            </span>
          </div>

          {/* Validation Turret (Center) */}
          <div className="absolute left-[380px] top-[100px] flex flex-col items-center z-10">
            <div className="w-12 h-12 bg-gray-800 border-2 border-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              🔫
            </div>
            <div className="h-20 w-1 bg-yellow-500/50 mt-2"></div>
          </div>

          {/* Enemies (Data Packets) */}
          {enemies.map((enemy) => {
            if (!enemy.active) {
              if (enemy.destroyedByTurret) {
                 return <div key={enemy.id} className="absolute top-1/2 -translate-y-1/2 text-2xl" style={{ left: `${enemy.x}px` }}>💥</div>;
              }
              return null; // Don't render if it reached DB
            }

            return (
              <div 
                key={enemy.id}
                className="absolute top-1/2 -translate-y-1/2 px-4 py-2 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-lg whitespace-nowrap font-bold flex items-center gap-2"
                style={{ left: `${enemy.x}px` }}
              >
                <span>📦</span>
                <span className={enemy.isBad ? 'text-red-400' : 'text-green-400'}>{enemy.text}</span>
              </div>
            );
          })}
        </div>

        {/* The Control Panel (IDE) */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl border-2 border-gray-700 shadow-2xl">
          <h3 className="text-yellow-400 font-black mb-2 uppercase tracking-widest text-sm flex items-center gap-2">
            <span>⚙️</span> Turret Configuration (Regex Rules)
          </h3>
          <p className="text-gray-500 text-xs mb-4">The turret will SHOOT any packet that matches your regex. Target tags `&lt; &gt;` and `SQL` commands.</p>
          
          <div className="flex bg-black p-4 rounded-xl border border-gray-800 items-center font-mono text-lg">
            <span className="text-blue-500 mr-2">/</span>
            <input 
              type="text" 
              value={regexInput}
              onChange={(e) => setRegexInput(e.target.value)}
              placeholder="e.g. <|>|SELECT"
              className="bg-transparent flex-1 text-yellow-300 outline-none placeholder-gray-700"
              disabled={gameState !== 'playing'}
            />
            <span className="text-blue-500 ml-2">/gi</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrokenKingdom;