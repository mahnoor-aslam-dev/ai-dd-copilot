// Rule-based risk patterns — Pakistan context ke hisaab se
const riskRules = [
  {
    id: 'missing_termination',
    keywords: ['termination for convenience', 'terminate without cause'],
    mustNotBeAbsent: true, // agar ye phrase POORE document mein nahi milta, to flag karo
    severity: 'moderate',
    description: 'No termination-for-convenience clause found — either party may be locked into the agreement.',
  },
  {
    id: 'non_compete_broad',
    keywords: ['non-compete', 'non compete', 'restraint of trade'],
    severity: 'high',
    description: 'Non-compete clause detected — review radius and duration for reasonableness.',
  },
  {
    id: 'unlimited_liability',
    keywords: ['unlimited liability', 'without limitation'],
    severity: 'high',
    description: 'Potential unlimited liability exposure — recommend capping liability.',
  },
  {
    id: 'auto_renewal',
    keywords: ['automatically renew', 'auto-renewal', 'automatic renewal'],
    severity: 'low',
    description: 'Auto-renewal clause found — confirm notice period to avoid unwanted renewal.',
  },
  {
    id: 'indemnity_broad',
    keywords: ['indemnify and hold harmless', 'broad indemnification'],
    severity: 'moderate',
    description: 'Broad indemnification clause — review scope of indemnified losses.',
  },
  {
    id: 'governing_law_foreign',
    keywords: ['governed by the laws of', 'jurisdiction of'],
    severity: 'low',
    description: 'Governing law clause found — confirm it aligns with Pakistan jurisdiction if expected.',
  },
];

module.exports = { riskRules };