const pool = require('../config/db');

async function saveChunks(documentId, chunks, embeddings) {
  const insertedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    const embeddingJson = JSON.stringify(embeddings[i]);
    const result = await pool.query(
      'INSERT INTO document_chunks (document_id, chunk_text, embedding) VALUES ($1, $2, $3) RETURNING id, document_id, chunk_text',
      [documentId, chunks[i], embeddingJson]
    );
    insertedChunks.push(result.rows[0]);
  }
  return insertedChunks;
}

async function getChunksByDocument(documentId) {
  const result = await pool.query(
    'SELECT * FROM document_chunks WHERE document_id = $1',
    [documentId]
  );
  return result.rows;
}

async function getAllChunksByCase(caseId) {
  const result = await pool.query(
    `SELECT dc.* FROM document_chunks dc
     JOIN documents d ON dc.document_id = d.id
     WHERE d.case_id = $1 AND dc.embedding IS NOT NULL`,
    [caseId]
  );
  return result.rows;
}

module.exports = { saveChunks, getChunksByDocument, getAllChunksByCase };