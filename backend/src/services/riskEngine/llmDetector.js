const genAI = require('../../config/gemini');

async function detectLLMRisks(chunks) {
  const sampleText = chunks.slice(0, 15).map(c => c.chunk_text).join('\n\n');

  const prompt = `Aap ek due diligence risk analyst hain. Neeche diya gaya document text parhein aur koi bhi unusual, risky, ya red-flag-worthy clauses identify karein jo predefined rules mein na hon (jaise: unusual payment terms, one-sided penalty clauses, vague obligations, missing key terms).

Document:
${sampleText}

Sirf ek JSON array return karein, is format mein, aur kuch nahi:
[{"severity": "low|moderate|high", "description": "chhota sa risk description"}]

Agar koi risk na mile, khali array return karein: []`;

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