const pool = require('../config/db');

async function saveRiskFlags(documentId, flags) {
  const saved = [];
  for (const flag of flags) {
    const result = await pool.query(
      `INSERT INTO risk_flags (document_id, flag_type, severity, description, source_chunk_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [documentId, flag.flag_type, flag.severity, flag.description, flag.source_chunk_id]
    );
    saved.push(result.rows[0]);
  }
  return saved;
}

async function getFlagsByCase(caseId) {
  const result = await pool.query(
    `SELECT rf.*, d.filename FROM risk_flags rf
     JOIN documents d ON rf.document_id = d.id
     WHERE d.case_id = $1
     ORDER BY 
       CASE rf.severity WHEN 'high' THEN 1 WHEN 'moderate' THEN 2 ELSE 3 END`,
    [caseId]
  );
  return result.rows;
}

module.exports = { saveRiskFlags, getFlagsByCase };