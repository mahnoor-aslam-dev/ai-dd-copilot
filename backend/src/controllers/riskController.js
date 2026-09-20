const { getFlagsByCase } = require('../models/riskFlagModel');
const { getCaseById } = require('../models/caseModel');

async function listFlags(req, res) {
  try {
    const { caseId } = req.params;
    const caseData = await getCaseById(caseId, req.user.userId);
    if (!caseData) return res.status(404).json({ error: 'Case nahi mila' });

    const flags = await getFlagsByCase(caseId);
    res.json(flags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { listFlags };