const Appliance = require('../models/Appliance');
const { buildDashboardData } = require('../services/calculationService');

async function getDashboard(req, res) {
  const appliances = await Appliance.find({ userId: req.user.id });
  const dashboard = buildDashboardData(appliances);

  res.json({ success: true, data: dashboard });
}

module.exports = { getDashboard };
