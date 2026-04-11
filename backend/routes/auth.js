const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  console.log("🚨 [DEBUG] Register API Hit! Data:", req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { name: username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Player or Email already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name: username, 
      email, 
      password: hashedPassword 
    });

    console.log("⏳ [DEBUG] Saving to MongoDB...");
    await newUser.save();
    console.log("🎉 [DEBUG] Saved successfully!");

    res.status(201).json({ message: 'Player registered successfully!' });
  } catch (err) {
    console.error("🔥 [ERROR]", err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Player not found!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      message: 'Login successful!', 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        level: user.level,
        rank: user.rank,
        coins: user.coins,
        activeAvatarId: user.activeAvatarId,
        unlockedAvatars: user.unlockedAvatars,
        earnedBadges: user.earnedBadges,       
        realms: user.realms
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- UPDATE PLAYER STATS (Coins, Avatars, Level, Rank, Realms, Badges) ---
router.post('/update-stats', async (req, res) => {
  try {
    const { userId, coins, activeAvatarId, unlockedAvatars, earnedBadges, level, rank, realms } = req.body;

    // Dynamic Update Object: Jo data frontend bhejega, sirf wahi DB mein update hoga
    const updateData = {};
    if (coins !== undefined) updateData.coins = coins;
    if (activeAvatarId !== undefined) updateData.activeAvatarId = activeAvatarId;
    if (unlockedAvatars !== undefined) updateData.unlockedAvatars = unlockedAvatars;
    if (earnedBadges !== undefined) updateData.earnedBadges = earnedBadges;
    if (level !== undefined) updateData.level = level;
    if (rank !== undefined) updateData.rank = rank;
    if (realms !== undefined) updateData.realms = realms;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Player not found in DB!' });
    }

    res.status(200).json({ message: 'Progress saved to DB!', user: updatedUser });
  } catch (err) {
    console.error("🔥 Error saving progress:", err);
    res.status(500).json({ message: 'Error saving progress' });
  }
});

module.exports = router;