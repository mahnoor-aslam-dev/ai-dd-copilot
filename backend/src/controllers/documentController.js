const { createDocument, getDocumentsByCase } = require('../models/documentModel');
const { getCaseById } = require('../models/caseModel');

async function uploadDocument(req, res) {
  try {
    const caseId = req.params.caseId;

    // Confirm karo ke ye case is user ka hai
    const caseData = await getCaseById(caseId, req.user.userId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case nahi mila' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Koi file upload nahi hui' });
    }

    const doc = await createDocument(
      caseId,
      req.file.originalname,
      req.file.path,
      req.file.mimetype
    );

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function listDocuments(req, res) {
  try {
    const docs = await getDocumentsByCase(req.params.caseId);
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { uploadDocument, listDocuments };