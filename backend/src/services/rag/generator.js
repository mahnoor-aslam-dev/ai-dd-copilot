const genAI = require('../../config/gemini');

async function generateAnswer(query, relevantChunks) {
  const context = relevantChunks
    .map((chunk, i) => `[Source ${i + 1}]\n${chunk.chunk_text}`)
    .join('\n\n');

  const prompt = `Aap ek due diligence assistant hain. Neeche diye gaye document excerpts ke base par sawal ka jawab dein. Agar jawab excerpts mein nahi milta, saaf keh dein ke "Ye information provided documents mein nahi mili".

Document Excerpts:
${context}

Sawal: ${query}

Jawab (sources cite karte hue, jaise [Source 1]):`;

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateAnswer };