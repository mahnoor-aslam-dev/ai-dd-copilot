const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { newCase, listCases, getCase, removeCase } = require('../controllers/caseController');

router.post('/', verifyToken, newCase);
router.get('/', verifyToken, listCases);
router.get('/:id', verifyToken, getCase);
router.delete('/:id', verifyToken, removeCase);

module.exports = router;