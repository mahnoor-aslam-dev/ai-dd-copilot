const { retrieveRelevantChunks } = require('../services/rag/retriever');
const { generateAnswer } = require('../services/rag/generator');
const { getCaseById } = require('../models/caseModel');

async function askQuestion(req, res) {
  try {
    const { caseId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Sawal zaroori hai' });
    }

    const caseData = await getCaseById(caseId, req.user.userId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case nahi mila' });
    }

    const relevantChunks = await retrieveRelevantChunks(question, caseId);

    if (relevantChunks.length === 0) {
      return res.json({ answer: 'Is case mein koi processed documents nahi hain.', sources: [] });
    }

    const answer = await generateAnswer(question, relevantChunks);

    res.json({
      answer,
      sources: relevantChunks.map(c => ({
        document_id: c.document_id,
        preview: c.chunk_text.substring(0, 100),
        relevance_score: c.score.toFixed(3)
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { askQuestion };