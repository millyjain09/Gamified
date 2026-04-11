const mongoose = require('mongoose');

const realmSchema = new mongoose.Schema({
  id: String,
  name: String,
  progress: { type: Number, default: 0 },
  color: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // --- GAMIFICATION STATS ---
  coins: {
    type: Number,
    default: 2500
  },
  max_xp: {
    type: Number,
    default: 5000
  },
  rank: {
    type: Number,
    default: 9999
  },
  level: {
    type: Number,
    default: 1
  },
  // --- ARMORY & PROGRESSION ---
  activeAvatarId: {
    type: Number,
    default: 1
  },
  unlockedAvatars: {
    type: [Number],
    default: [1]
  },
  earnedBadges: {
    type: [Number],
    default: [] 
  },
  realms: {
    type: [realmSchema],
    default: [
      { id: 'dsa', name: 'DSA Dojo', progress: 0, color: 'text-cyan-400' },
      { id: 'fs', name: 'Fullstack Fortress', progress: 0, color: 'text-purple-400' }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);