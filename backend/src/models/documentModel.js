const pool = require('../config/db');

async function createDocument(caseId, filename, filePath, docType) {
  const result = await pool.query(
    'INSERT INTO documents (case_id, filename, file_path, doc_type) VALUES ($1, $2, $3, $4) RETURNING *',
    [caseId, filename, filePath, docType]
  );
  return result.rows[0];
}

async function getDocumentsByCase(caseId) {
  const result = await pool.query(
    'SELECT * FROM documents WHERE case_id = $1 ORDER BY created_at DESC',
    [caseId]
  );
  return result.rows;
}

module.exports = { createDocument, getDocumentsByCase };