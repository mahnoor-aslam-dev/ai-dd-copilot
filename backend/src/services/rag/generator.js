const genAI = require('../../config/gemini');

const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.5-flash-lite', 'gemini-pro-latest', 'gemini-flash-lite-latest'];

async function generateAnswer(query, relevantChunks) {
  const context = relevantChunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk.chunk_text}`)
    .join('\n\n');

  const prompt = `You are a due diligence assistant. Answer the question below using only the document excerpts provided. If the answer cannot be found in the excerpts, clearly say "This information was not found in the provided documents."

Always respond in English, regardless of the language of the source documents or the question.

Document Excerpts:
${context}

Question: ${query}

Answer (cite sources like [Source 1]):`;

  let lastError;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error(`Model ${modelName} failed (${err.status}):`, err.message);
      lastError = err;
      continue;
    }
  }

  throw lastError;
}

module.exports = { generateAnswer };