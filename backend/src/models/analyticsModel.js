const pool = require('../config/db');

async function getCasesSummary(userId) {
  const result = await pool.query(
    `SELECT 
       c.id, c.title, c.created_at,
       COUNT(DISTINCT d.id) AS total_docs,
       COUNT(DISTINCT d.id) FILTER (WHERE d.upload_status = 'processed') AS ready_docs,
       COUNT(DISTINCT rf.id) AS total_flags
     FROM cases c
     LEFT JOIN documents d ON d.case_id = c.id
     LEFT JOIN risk_flags rf ON rf.document_id = d.id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return result.rows;
}

async function getFlagsBySeverity(userId) {
  const result = await pool.query(
    `SELECT rf.severity, COUNT(*) as count
     FROM risk_flags rf
     JOIN documents d ON rf.document_id = d.id
     JOIN cases c ON d.case_id = c.id
     WHERE c.user_id = $1
     GROUP BY rf.severity`,
    [userId]
  );
  return result.rows;
}

async function getFlagsByType(userId) {
  const result = await pool.query(
    `SELECT rf.flag_type, COUNT(*) as count
     FROM risk_flags rf
     JOIN documents d ON rf.document_id = d.id
     JOIN cases c ON d.case_id = c.id
     WHERE c.user_id = $1
     GROUP BY rf.flag_type
     ORDER BY count DESC
     LIMIT 6`,
    [userId]
  );
  return result.rows;
}

async function getDocumentsByStatus(userId) {
  const result = await pool.query(
    `SELECT d.upload_status, COUNT(*) as count
     FROM documents d
     JOIN cases c ON d.case_id = c.id
     WHERE c.user_id = $1
     GROUP BY d.upload_status`,
    [userId]
  );
  return result.rows;
}

async function getCasesTimeline(userId) {
  const result = await pool.query(
    `SELECT DATE(created_at) as day, COUNT(*) as count
     FROM cases
     WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
     GROUP BY DATE(created_at)
     ORDER BY day ASC`,
    [userId]
  );
  return result.rows;
}

async function getRecentActivity(userId) {
  const result = await pool.query(
    `SELECT d.id, d.filename, d.upload_status, d.created_at, c.id as case_id, c.title as case_title
     FROM documents d
     JOIN cases c ON d.case_id = c.id
     WHERE c.user_id = $1
     ORDER BY d.created_at DESC
     LIMIT 25`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  getCasesSummary,
  getFlagsBySeverity,
  getFlagsByType,
  getDocumentsByStatus,
  getCasesTimeline,
  getRecentActivity,
};