// // Rule-based risk patterns — Pakistan context ke hisaab se
const riskRules = [
  {
    id: 'missing_termination',
    keywords: ['termination for convenience', 'terminate without cause'],
    mustNotBeAbsent: true,
    severity: 'moderate',
    description: 'Neither side can end this agreement early just because they want to. Both parties may be stuck in it longer than expected.',
  },
  {
    id: 'non_compete_broad',
    keywords: ['non-compete', 'non compete', 'restraint of trade'],
    severity: 'high',
    description: 'This stops one party from starting a similar business nearby for a period of time. Check if the distance and time limit seem fair.',
  },
  {
    id: 'unlimited_liability',
    keywords: ['unlimited liability', 'without limitation'],
    severity: 'high',
    description: 'There is no cap on how much one party could owe if something goes wrong. This could turn out very expensive.',
  },
  {
    id: 'auto_renewal',
    keywords: ['automatically renew', 'auto-renewal', 'automatic renewal'],
    severity: 'low',
    description: 'This agreement renews itself automatically unless someone cancels it in time. Make a note of the cancellation deadline.',
  },
  {
    id: 'indemnity_broad',
    keywords: ['indemnify and hold harmless', 'broad indemnification'],
    severity: 'moderate',
    description: 'One party has agreed to cover a wide range of costs and losses for the other. Check exactly what this could include.',
  },
  {
    id: 'governing_law_foreign',
    keywords: ['governed by the laws of', 'jurisdiction of'],
    severity: 'low',
    description: 'This document names which country\'s laws apply if there is a dispute. Confirm this is what both sides expected.',
  },
];

module.exports = { riskRules };