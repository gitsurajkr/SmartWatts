const Appliance = require('../models/Appliance');
const User = require('../models/User');
const { buildDashboardData } = require('../services/calculationService');
const aiService = require('../services/aiService');

async function getUserData(userId) {
  const [appliances, user] = await Promise.all([
    Appliance.find({ userId }),
    User.findById(userId),
  ]);
  const dashboard = buildDashboardData(appliances);
  return { appliances, dashboard, budget: user?.monthlyBudget || null };
}

async function chatHandler(req, res) {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }

  const { appliances, dashboard, budget } = await getUserData(req.user.id);
  const reply = await aiService.chat(message.trim(), appliances, dashboard, budget);

  res.json({ success: true, data: { reply } });
}

async function insightsHandler(req, res) {
  const { appliances, dashboard, budget } = await getUserData(req.user.id);
  const insights = await aiService.generateInsights(appliances, dashboard, budget, req.user.id);

  res.json({ success: true, data: insights });
}

async function monthlyReportHandler(req, res) {
  const { appliances, dashboard, budget } = await getUserData(req.user.id);
  const report = await aiService.generateMonthlyReport(appliances, dashboard, budget, req.user.id);

  res.json({ success: true, data: { report } });
}

async function alertsHandler(req, res) {
  const { appliances, dashboard, budget } = await getUserData(req.user.id);
  const alerts = await aiService.generateAlerts(appliances, dashboard, budget, req.user.id);

  res.json({ success: true, data: alerts });
}

async function budgetAdviceHandler(req, res) {
  const { appliances, dashboard, budget } = await getUserData(req.user.id);
  const advice = await aiService.budgetAdvice(appliances, dashboard, budget, req.user.id);

  res.json({ success: true, data: { advice } });
}

async function setBudgetHandler(req, res) {
  const { budget } = req.body;
  if (budget === undefined || budget === null || Number(budget) < 0) {
    return res.status(400).json({ success: false, error: 'Valid budget amount is required' });
  }

  await User.findByIdAndUpdate(req.user.id, { monthlyBudget: Number(budget) });
  aiService.invalidateUser(req.user.id);

  res.json({ success: true, data: { budget: Number(budget) } });
}

async function getBudgetHandler(req, res) {
  const user = await User.findById(req.user.id);

  res.json({ success: true, data: { budget: user?.monthlyBudget || null } });
}

module.exports = {
  chatHandler,
  insightsHandler,
  monthlyReportHandler,
  alertsHandler,
  budgetAdviceHandler,
  setBudgetHandler,
  getBudgetHandler,
};
