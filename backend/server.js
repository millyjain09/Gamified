const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Socket.io ke liye HTTP zaroori hai
const { Server } = require('socket.io'); // Socket.io import kiya
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app); // Express app ko HTTP server mein wrap kiya

// Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Tera React Frontend Port (agar 3000 hai toh 3000 kar dena)
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));


// --- ⚔️ REAL-TIME MATCHMAKING ENGINE ⚔️ ---
let waitingPlayer = null; // Jo player match dhoondh raha hai wo yahan wait karega

io.on('connection', (socket) => {
  console.log('⚡ A Player Connected! Socket ID:', socket.id);

  // 1. Jab koi player 'Find Match' pe click karega
  socket.on('search_match', (playerData) => {
    console.log(`🔍 ${playerData.username} is searching for a match...`);

    if (waitingPlayer && waitingPlayer.socket.id !== socket.id) {
      // MATCH MIL GAYA! Ek player pehle se wait kar raha tha
      const roomName = `arena_${waitingPlayer.socket.id}_${socket.id}`;
      
      // Dono players ko ek "Room" (Battleground) mein daal do
      socket.join(roomName);
      waitingPlayer.socket.join(roomName);

      console.log(`⚔️ Match Started in ${roomName}`);

      // Dono ko bata do ki match mil gaya hai!
      io.to(roomName).emit('match_found', {
        room: roomName,
        opponentForP1: playerData, // Waiting player ko iska data milega
        opponentForP2: waitingPlayer.playerData // Naye player ko waiting wale ka data milega
      });

      waitingPlayer = null; // Queue khali kar do agle players ke liye
    } else {
      // Koi nahi hai, toh isko waiting mein daal do
      waitingPlayer = { socket, playerData };
      console.log(`⏳ ${playerData.username} is waiting in queue...`);
    }
  });

  // 2. Jab player question solve kar lega
  socket.on('question_solved', ({ room, qIdx }) => {
    // Apne opponent ko message bhejo ki "Maine solve kar liya hai!"
    socket.to(room).emit('opponent_solved', { qIdx });
  });

  // 3. Jab player disconnect ho jaye (Page cut kar de)
  socket.on('disconnect', () => {
    console.log('❌ Player Disconnected:', socket.id);
    if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
      waitingPlayer = null; // Queue se hata do
    }
  });
});

// Start Server (ab app.listen ki jagah server.listen hoga)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});