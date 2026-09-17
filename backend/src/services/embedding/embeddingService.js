const genAI = require('../../config/gemini');

async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function generateEmbeddingsForChunks(chunks) {
  const embeddings = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    embeddings.push(embedding);
  }
  return embeddings;
}

module.exports = { generateEmbedding, generateEmbeddingsForChunks };