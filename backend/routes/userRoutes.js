const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// HUD Data Route
router.get('/dashboard', userController.getDashboardData);

// Armory Routes
router.post('/avatar/purchase', userController.purchaseAvatar);
router.post('/avatar/equip', userController.equipAvatar);

module.exports = router;