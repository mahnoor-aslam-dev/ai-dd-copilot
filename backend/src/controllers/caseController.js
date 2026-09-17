const { createCase, getCasesByUser, getCaseById } = require('../models/caseModel');

async function newCase(req, res) {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title zaroori hai' });
    }
    const caseData = await createCase(req.user.userId, title, description);
    res.status(201).json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function listCases(req, res) {
  try {
    const cases = await getCasesByUser(req.user.userId);
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getCase(req, res) {
  try {
    const caseData = await getCaseById(req.params.id, req.user.userId);
    if (!caseData) {
      return res.status(404).json({ error: 'Case nahi mila' });
    }
    res.json(caseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { newCase, listCases, getCase };