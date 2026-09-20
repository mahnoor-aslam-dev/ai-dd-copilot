const { createDocument, getDocumentsByCase, deleteDocument } = require('../models/documentModel');
const { getCaseById } = require('../models/caseModel');
const { extractTextFromPDF } = require('../services/ingestion/textExtractor');
const { chunkText } = require('../services/ingestion/chunker');
const { saveChunks } = require('../models/chunkModel');
const { generateEmbeddingsForChunks } = require('../services/embedding/embeddingService');
const { detectRuleBasedRisks } = require('../services/riskEngine/ruleDetector');
const { detectLLMRisks } = require('../services/riskEngine/llmDetector');
const { saveRiskFlags } = require('../models/riskFlagModel');
const pool = require('../config/db');
const fs = require('fs');

async function uploadDocument(req, res) {
  try {
    const caseId = req.params.caseId;

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

    res.status(201).json({ ...doc, upload_status: 'processing' });

    try {
      const text = await extractTextFromPDF(req.file.path);
      const chunks = chunkText(text);

      console.log(`Generating embeddings for ${chunks.length} chunks...`);
      const embeddings = await generateEmbeddingsForChunks(chunks);

      const savedChunks = await saveChunks(doc.id, chunks, embeddings);
      console.log(`Document ${doc.id}: ${chunks.length} chunks + embeddings saved`);

      console.log('Running risk detection...');
      const ruleFlags = detectRuleBasedRisks(savedChunks);
      const llmFlags = await detectLLMRisks(savedChunks);
      const allFlags = [...ruleFlags, ...llmFlags];

      if (allFlags.length > 0) {
        await saveRiskFlags(doc.id, allFlags);
        console.log(`${allFlags.length} risk flags saved for document ${doc.id}`);
      } else {
        console.log(`No risk flags detected for document ${doc.id}`);
      }

      await pool.query(
        "UPDATE documents SET upload_status = 'processed' WHERE id = $1",
        [doc.id]
      );
    } catch (processErr) {
      console.error('Processing error:', processErr);
      await pool.query(
        "UPDATE documents SET upload_status = 'failed' WHERE id = $1",
        [doc.id]
      );
    }
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

async function removeDocument(req, res) {
  try {
    const { caseId, docId } = req.params;

    const caseData = await getCaseById(caseId, req.user.userId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case nahi mila' });
    }

    const deleted = await deleteDocument(docId, caseId);
    if (!deleted) {
      return res.status(404).json({ error: 'Document nahi mila' });
    }

    if (deleted.file_path && fs.existsSync(deleted.file_path)) {
      fs.unlinkSync(deleted.file_path);
    }

    res.json({ message: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { uploadDocument, listDocuments, removeDocument };