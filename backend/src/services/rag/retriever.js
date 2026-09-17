const { generateEmbedding } = require('../embedding/embeddingService');
const { cosineSimilarity } = require('../embedding/similarity');
const { getAllChunksByCase } = require('../../models/chunkModel');

async function retrieveRelevantChunks(query, caseId, topK = 5) {
  const queryEmbedding = await generateEmbedding(query);
  const allChunks = await getAllChunksByCase(caseId);

  const scoredChunks = allChunks
    .map(chunk => {
      try {
        const chunkEmbedding = JSON.parse(chunk.embedding);
        const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
        return { ...chunk, score };
      } catch (e) {
        return null; // Agar parse ya calculation fail ho, is chunk ko skip karo
      }
    })
    .filter(item => item !== null);

  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK);
}

module.exports = { retrieveRelevantChunks };