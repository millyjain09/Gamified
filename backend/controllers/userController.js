
const User=require('../models/User');
// Fetch complete user data for the Dashboard HUD
exports.getDashboardData = async (req, res) => {
  try {
    // Note: Hum abhi dummy user ID use kar rahe hain. 
    // Baad mein yeh req.user.id se aayega jab JWT Auth lag jayega.
    const userId = req.body.userId || req.query.userId; 
    
    const user = await User.findById(userId).select('-password'); // Password frontend pe nahi bhejna
    if (!user) {
      return res.status(404).json({ message: 'Operator not found in database.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server breach detected (Internal Error)' });
  }
};

// Purchase an Avatar using Coins/XP
exports.purchaseAvatar = async (req, res) => {
  try {
    const { userId, avatarId, cost } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already unlocked
    if (user.unlockedAvatars.includes(avatarId)) {
      return res.status(400).json({ message: 'Avatar already unlocked.' });
    }

    // Check if user has enough coins
    if (user.coins < cost) {
      return res.status(400).json({ message: 'INSUFFICIENT FUNDS.' });
    }

    // Deduct coins and add avatar
    user.coins -= cost;
    user.unlockedAvatars.push(avatarId);
    user.activeAvatarId = avatarId; // Automatically equip it

    await user.save();

    res.status(200).json({ 
      message: 'Avatar Deployed Successfully!', 
      coins: user.coins,
      unlockedAvatars: user.unlockedAvatars,
      activeAvatarId: user.activeAvatarId
    });
  } catch (error) {
    res.status(500).json({ error: 'Transaction failed.' });
  }
};

// Equip an already unlocked avatar
exports.equipAvatar = async (req, res) => {
    try {
        const { userId, avatarId } = req.body;
        const user = await User.findById(userId);
        
        if (!user.unlockedAvatars.includes(avatarId)) {
            return res.status(403).json({ message: 'Avatar is locked.' });
        }

        user.activeAvatarId = avatarId;
        await user.save();
        
        res.status(200).json({ message: 'Avatar Equipped.', activeAvatarId: user.activeAvatarId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to equip avatar.' });
    }
}