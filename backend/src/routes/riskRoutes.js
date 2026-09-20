const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { listFlags } = require('../controllers/riskController');

router.get('/:caseId', verifyToken, listFlags);

module.exports = router;