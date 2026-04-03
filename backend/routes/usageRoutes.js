const express = require('express');
const router = express.Router();
const { logUsage, getUsage, getWeeklyTrend } = require('../controllers/usageController');

router.post('/', logUsage);
router.get('/', getUsage);
router.get('/weekly-trend', getWeeklyTrend);

module.exports = router;
