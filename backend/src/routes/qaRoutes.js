const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { askQuestion } = require('../controllers/qaController');

router.post('/:caseId/ask', verifyToken, askQuestion);

module.exports = router;