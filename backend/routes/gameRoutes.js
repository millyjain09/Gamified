const express = require('express');
const router = express.Router();
const { generateDebugQuestion } = require('../controllers/gameController');

router.post('/debug/generate', generateDebugQuestion);

module.exports = router;