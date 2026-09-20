const { riskRules } = require('./rules');

function detectRuleBasedRisks(chunks) {
  const fullText = chunks.map(c => c.chunk_text).join(' ').toLowerCase();
  const flags = [];

  for (const rule of riskRules) {
    const found = rule.keywords.some(kw => fullText.includes(kw.toLowerCase()));

    if (rule.mustNotBeAbsent && !found) {
      flags.push({
        flag_type: rule.id,
        severity: rule.severity,
        description: rule.description,
        source_chunk_id: null,
      });
    } else if (!rule.mustNotBeAbsent && found) {
      // Us chunk ko dhoondo jisme keyword mila, taake source cite ho sake
      const matchingChunk = chunks.find(c =>
        rule.keywords.some(kw => c.chunk_text.toLowerCase().includes(kw.toLowerCase()))
      );
      flags.push({
        flag_type: rule.id,
        severity: rule.severity,
        description: rule.description,
        source_chunk_id: matchingChunk ? matchingChunk.id : null,
      });
    }
  }

  return flags;
}

module.exports = { detectRuleBasedRisks };