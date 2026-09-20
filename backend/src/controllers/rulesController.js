const { riskRules } = require('../services/riskEngine/rules');

function listRules(req, res) {
  // Sirf public-facing info return karo (keywords internal detail hain)
  const publicRules = riskRules.map(r => ({
    id: r.id,
    severity: r.severity,
    description: r.description,
  }));
  res.json(publicRules);
}

module.exports = { listRules };