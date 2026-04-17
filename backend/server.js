const express = require('express');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { v4: uuidv4 } = require('uuid'); 
require('dotenv').config();

const gameRoutes = require('./routes/gameRoutes');

const app = express();
const server = http.createServer(app); 

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- REST API ROUTES ---
app.use('/api/games', gameRoutes);

// ==========================================
// ⚔️ SOCKET.IO MATCHMAKING LOGIC (ALGO ARENA)
// ==========================================

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

const waitingQueues = { easy: [], mid: [], high: [] };
const activeBattles = {};

// 🤖 1. NAYA FUNCTION: AI BOT SIMULATOR
function startAILogic(roomId, level, io) {
    const battle = activeBattles[roomId];
    if (!battle || !battle.isAI) return;

    if (battle.aiTimer) clearTimeout(battle.aiTimer);
    if (battle.aiStatusTimer) clearInterval(battle.aiStatusTimer);

    let isCompiling = false;

    // AI typing animation
    battle.aiStatusTimer = setInterval(() => {
        if (isCompiling) return;
        const statuses = ["Typing...", "Thinking...", "Typing..."];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        io.to(roomId).emit("opp_status", randomStatus);
    }, 3000);

    // Timing logic based on difficulty (Easy: 30-45s)
    let solveTimeMs = Math.floor(Math.random() * 15000) + 30000; 
    if (level === 'mid') solveTimeMs += 20000;
    if (level === 'high') solveTimeMs += 50000;

    // AI solving and sending attack
    battle.aiTimer = setTimeout(() => {
        isCompiling = true;
        io.to(roomId).emit("opp_status", "Compiling ⚙️...");

        setTimeout(() => {
            if (activeBattles[roomId] && activeBattles[roomId].currentQuestion <= 3) {
                handleQuestionSolved(roomId, "ai_bot", io);
            }
        }, 3000);
    }, solveTimeMs);
}

// 🏆 2. NAYA FUNCTION: ROUND COMPLETION LOGIC
function handleQuestionSolved(roomId, solverId, io) {
    const battle = activeBattles[roomId];
    if (!battle) return;

    if (battle.aiTimer) clearTimeout(battle.aiTimer);
    if (battle.aiStatusTimer) clearInterval(battle.aiStatusTimer);

    if(!battle.scores) battle.scores = {};
    battle.scores[solverId] = (battle.scores[solverId] || 0) + 1;

    io.to(roomId).emit("round_over", { winnerId: solverId });

    setTimeout(() => {
        battle.currentQuestion++;
        
        if (battle.currentQuestion > 3) {
            const players = Object.keys(battle.players);
            const score1 = battle.scores[players[0]] || 0;
            const score2 = battle.scores[players[1]] || 0;
            
            let overallWinner = "Tie";
            if(score1 > score2) overallWinner = battle.players[players[0]].username;
            else if(score2 > score1) overallWinner = battle.players[players[1]].username;

            io.to(roomId).emit("game_over", { overallWinner });
        } else {
            io.to(roomId).emit("next_question", { qIndex: battle.currentQuestion - 1 });
            
            if (battle.isAI) {
                startAILogic(roomId, battle.level, io);
            }
        }
    }, 4000);
}

io.on('connection', (socket) => {
    console.log(`⚡ Player connected to Arena: ${socket.id}`);

    // 🔄 LIVE STATUS TRACKER (Typing / Compiling)
    socket.on("update_status", ({ roomId, status }) => {
        socket.to(roomId).emit("opp_status", status);
    });

    // ⚔️ ATTACK LISTENER
    socket.on("attack", ({ roomId, damage, message }) => {
        socket.to(roomId).emit("receive_damage", { damage, message });
    });

    // 🏆 3. UPDATED: JAB KOI QUESTION SOLVE KAR LE (Direct naya function call)
    socket.on("question_solved", ({ roomId }) => {
        handleQuestionSolved(roomId, socket.id, io);
    });

    // 🎮 JOIN QUEUE LISTENER
    socket.on("join_queue", ({ userId, username, level }) => {
        console.log(`🎮 ${username} joined [${level}] tier queue.`);
        
        if (!['easy', 'mid', 'high'].includes(level)) return;

        const queue = waitingQueues[level];

        if (queue.length > 0) {
            const opponent = queue.shift(); 
            const roomId = `arena_${uuidv4()}`; 

            socket.join(roomId);
            io.sockets.sockets.get(opponent.socketId)?.join(roomId);

            activeBattles[roomId] = {
                players: {
                    [socket.id]: { hp: 100, username },
                    [opponent.socketId]: { hp: 100, username: opponent.username }
                },
                level: level,
                currentQuestion: 1, 
                isAI: false,
                scores: {} 
            };

            io.to(roomId).emit("match_found", {
                roomId,
                opponent: opponent.username,
                message: "Rival Found! Battle Commences!"
            });

        } else {
            const playerObj = { socketId: socket.id, userId, username };
            queue.push(playerObj);

            setTimeout(() => {
                const index = waitingQueues[level].findIndex(p => p.socketId === socket.id);
                
                if (index !== -1) {
                    waitingQueues[level].splice(index, 1); 
                    
                    const roomId = `arena_ai_${uuidv4()}`;
                    socket.join(roomId);

                    activeBattles[roomId] = {
                        players: {
                            [socket.id]: { hp: 100, username },
                            "ai_bot": { hp: 100, username: "Shadow Bot (AI)" }
                        },
                        level: level,
                        currentQuestion: 1,
                        isAI: true,
                        scores: {} 
                    };

                    socket.emit("match_found", {
                        roomId,
                        opponent: "Shadow Bot (AI)",
                        message: "No human found. AI Shadow Activated!"
                    });

                    // 🚀 4. UPDATED: START AI LOGIC HERE
                    startAILogic(roomId, level, io);
                }
            }, 10000); 
        }
    });

    // ================================
// ⚡ CODE RACE (REALTIME CODING)
// ================================

const activeRaces = {};

socket.on("join_code_race", ({ username }) => {
    const roomId = `code_race_${uuidv4()}`;
    socket.join(roomId);

    activeRaces[roomId] = {
        players: {
            [socket.id]: { username, progress: 0 }
        },
        started: false
    };

    socket.emit("race_joined", { roomId });

    // wait for opponent
    setTimeout(() => {
        const race = activeRaces[roomId];
        if (!race || race.started) return;

        // AI opponent fallback
        race.players["ai_bot"] = {
            username: "Speed Bot 🤖",
            progress: 0
        };

        race.started = true;

        socket.emit("race_start", {
            opponent: "Speed Bot 🤖"
        });

        startRaceAI(roomId);
    }, 5000);
});


// 🔁 JOIN EXISTING ROOM (MULTIPLAYER)
socket.on("join_existing_race", ({ roomId, username }) => {
    const race = activeRaces[roomId];
    if (!race) return;

    socket.join(roomId);

    race.players[socket.id] = {
        username,
        progress: 0
    };

    race.started = true;

    io.to(roomId).emit("race_start", {
        opponent: Object.values(race.players)
            .find(p => p.username !== username)?.username
    });
});


// 📊 LIVE PROGRESS UPDATE
socket.on("race_progress", ({ roomId, progress }) => {
    const race = activeRaces[roomId];
    if (!race) return;

    if (race.players[socket.id]) {
        race.players[socket.id].progress = progress;
    }

    socket.to(roomId).emit("opponent_progress", progress);

    // 🏆 WIN CONDITION
    if (progress >= 100) {
        io.to(roomId).emit("race_winner", {
            winner: socket.id
        });

        delete activeRaces[roomId];
    }
});


// 🤖 AI LOGIC FOR RACE
function startRaceAI(roomId) {
    const race = activeRaces[roomId];
    if (!race) return;

    let aiProgress = 0;

    const interval = setInterval(() => {
        if (!activeRaces[roomId]) {
            clearInterval(interval);
            return;
        }

        aiProgress += Math.floor(Math.random() * 15) + 5;

        io.to(roomId).emit("opponent_progress", aiProgress);

        if (aiProgress >= 100) {
            io.to(roomId).emit("race_winner", {
                winner: "ai_bot"
            });

            delete activeRaces[roomId];
            clearInterval(interval);
        }
    }, 1500);
}

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        console.log(`❌ Player disconnected: ${socket.id}`);
        ['easy', 'mid', 'high'].forEach(level => {
            waitingQueues[level] = waitingQueues[level].filter(p => p.socketId !== socket.id);
        });
    });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🤖 Gemini API is ready to generate anomalies!`);
    console.log(`⚔️  Algo Arena Socket.io Engine is LIVE!`);
});