const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { listRules } = require('../controllers/rulesController');

router.get('/', verifyToken, listRules);

module.exports = router;