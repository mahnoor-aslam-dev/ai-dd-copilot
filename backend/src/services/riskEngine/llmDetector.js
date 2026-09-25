const genAI = require('../../config/gemini');

async function detectLLMRisks(chunks) {
  const sampleText = chunks.slice(0, 15).map(c => c.chunk_text).join('\n\n');

  const prompt = `You are a due diligence risk analyst. Read the document text below and identify any unusual, risky, or red-flag-worthy clauses that don't match predefined rules (e.g. unusual payment terms, one-sided penalty clauses, vague obligations, missing key terms).

Document:
${sampleText}

Write each description in plain, simple English that a non-lawyer can easily understand. Avoid legal jargon. Keep each description to one or two short sentences.

Return only a JSON array, in this format, nothing else:
[{"severity": "low|moderate|high", "description": "brief risk description in simple English"}]

If no risks are found, return an empty array: []`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    text = text.replace(/```json|```/g, '').trim();

    const risks = JSON.parse(text);
    return risks.map(r => ({
      flag_type: 'ai_detected',
      severity: r.severity || 'moderate',
      description: r.description,
      source_chunk_id: null,
    }));
  } catch (err) {
    console.error('LLM risk detection failed:', err.message);
    return [];
  }
}

module.exports = { detectLLMRisks };