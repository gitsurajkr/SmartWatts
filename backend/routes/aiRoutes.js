const express = require('express');
const router = express.Router();
const {
  chatHandler,
  insightsHandler,
  monthlyReportHandler,
  alertsHandler,
  budgetAdviceHandler,
  setBudgetHandler,
  getBudgetHandler,
} = require('../controllers/aiController');

router.post('/chat', chatHandler);
router.get('/insights', insightsHandler);
router.get('/monthly-report', monthlyReportHandler);
router.get('/alerts', alertsHandler);
router.get('/budget-advice', budgetAdviceHandler);
router.put('/budget', setBudgetHandler);
router.get('/budget', getBudgetHandler);

module.exports = router;
