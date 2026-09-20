const {
  getCasesSummary,
  getFlagsBySeverity,
  getFlagsByType,
  getDocumentsByStatus,
  getCasesTimeline,
  getRecentActivity,
} = require('../models/analyticsModel');

async function getAnalytics(req, res) {
  try {
    const userId = req.user.userId;

    const [casesSummary, flagsBySeverity, flagsByType, documentsByStatus, casesTimeline, recentActivity] =
      await Promise.all([
        getCasesSummary(userId),
        getFlagsBySeverity(userId),
        getFlagsByType(userId),
        getDocumentsByStatus(userId),
        getCasesTimeline(userId),
        getRecentActivity(userId),
      ]);

    const totalCases = casesSummary.length;
    const totalDocuments = casesSummary.reduce((sum, c) => sum + Number(c.total_docs), 0);
    const totalFlags = casesSummary.reduce((sum, c) => sum + Number(c.total_flags), 0);
    const avgFlagsPerCase = totalCases > 0 ? (totalFlags / totalCases).toFixed(1) : 0;

    res.json({
      totalCases,
      totalDocuments,
      totalFlags,
      avgFlagsPerCase,
      casesSummary,
      flagsBySeverity,
      flagsByType,
      documentsByStatus,
      casesTimeline,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getAnalytics };