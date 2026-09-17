const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');
const { uploadDocument, listDocuments } = require('../controllers/documentController');

// Multer config — file kahan save hogi aur naam kaise milega
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Sirf PDF aur DOCX files allowed hain'));
    }
  }
});

router.post('/:caseId/upload', verifyToken, upload.single('document'), uploadDocument);
router.get('/:caseId', verifyToken, listDocuments);

module.exports = router;