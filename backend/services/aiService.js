const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildDashboardData, RATE_PER_UNIT, calculateMonthlyUnits, calculateBill } = require('./calculationService');
const prompts = require('./aiPrompts');

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite'});
  }
  return model;
}

// Per-user in-memory cache to avoid duplicate Gemini calls
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 200;

function getCacheKey(userId, endpoint, dataHash) {
  return `${userId}:${endpoint}:${dataHash}`;
}

function dataFingerprint(appliances, dashboard, budget) {
  return `${dashboard.totalBill}|${dashboard.totalUnits}|${appliances.length}|${budget || 0}`;
}

function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value) {
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldest = responseCache.keys().next().value;
    responseCache.delete(oldest);
  }
  responseCache.set(key, { value, ts: Date.now() });
}

function invalidateUser(userId) {
  for (const key of responseCache.keys()) {
    if (key.startsWith(`${userId}:`)) {
      responseCache.delete(key);
    }
  }
}

function buildUserContext(appliances, dashboard, budget) {
  const breakdown = dashboard.breakdown.map((b) => ({
    name: b.name,
    watts: b.watts,
    hoursPerDay: b.hoursPerDay,
    daysPerWeek: b.daysPerWeek,
    monthlyUnits: b.monthlyUnits,
    monthlyCost: b.monthlyCost,
    percentage: b.percentage,
    status: b.status,
  }));

  return {
    monthlyBill: dashboard.totalBill,
    totalUnits: dashboard.totalUnits,
    ratePerUnit: dashboard.ratePerUnit,
    totalDevices: dashboard.totalDevices,
    activeDevices: dashboard.activeDevices,
    topAppliance: dashboard.topAppliance ? dashboard.topAppliance.name : null,
    topApplianceUnits: dashboard.topAppliance ? dashboard.topAppliance.monthlyUnits : 0,
    topAppliancePercentage: dashboard.topAppliance ? dashboard.topAppliance.percentage : 0,
    estimatedSavings: dashboard.savings.amount,
    savingsTip: dashboard.savings.tip,
    budget: budget || null,
    appliances: breakdown,
  };
}

async function callGemini(prompt, timeoutMs = 20000) {
  const m = getModel();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await m.generateContent(prompt, { signal: controller.signal });
    const response = result.response;
    return response.text();
  } catch (err) {
    clearTimeout(timer);
    if (err.message && err.message.includes('429')) {
      throw new Error('AI service is temporarily rate-limited. Please try again in a minute.');
    }
    if (err.name === 'AbortError') {
      throw new Error('AI request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function chat(userMessage, appliances, dashboard, budget) {
  const context = buildUserContext(appliances, dashboard, budget);
  const prompt = prompts.chatPrompt(context, userMessage);
  return callGemini(prompt);
}

async function generateInsights(appliances, dashboard, budget, userId) {
  if (appliances.length === 0) {
    return [];
  }

  const cacheKey = getCacheKey(userId, 'insights', dataFingerprint(appliances, dashboard, budget));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const context = buildUserContext(appliances, dashboard, budget);
  const prompt = prompts.insightsPrompt(context);
  const text = await callGemini(prompt);

  let result;
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    result = Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    result = text
      .split('\n')
      .filter((line) => line.trim().length > 10)
      .slice(0, 3)
      .map((line) => ({
        type: 'insight',
        message: line.replace(/^[-*•\d.)\s]+/, '').trim(),
        severity: 'info',
      }));
  }

  setCache(cacheKey, result);
  return result;
}

async function generateMonthlyReport(appliances, dashboard, budget, userId) {
  if (appliances.length === 0) {
    return 'No appliances registered yet. Add your devices to receive a monthly AI energy report.';
  }

  const cacheKey = getCacheKey(userId, 'report', dataFingerprint(appliances, dashboard, budget));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const context = buildUserContext(appliances, dashboard, budget);
  const prompt = prompts.monthlyReportPrompt(context);
  const result = await callGemini(prompt);

  setCache(cacheKey, result);
  return result;
}

async function generateAlerts(appliances, dashboard, budget, userId) {
  if (appliances.length === 0) return [];

  const cacheKey = getCacheKey(userId, 'alerts', dataFingerprint(appliances, dashboard, budget));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const context = buildUserContext(appliances, dashboard, budget);
  const prompt = prompts.alertsPrompt(context);
  const text = await callGemini(prompt);

  let result;
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    result = Array.isArray(parsed) ? parsed.slice(0, 5) : [];
  } catch {
    result = [];
  }

  setCache(cacheKey, result);
  return result;
}

async function budgetAdvice(appliances, dashboard, budget, userId) {
  if (!budget || appliances.length === 0) {
    return 'Set a monthly budget and add appliances to receive personalized budget optimization advice.';
  }

  const cacheKey = getCacheKey(userId, 'budget', dataFingerprint(appliances, dashboard, budget));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const context = buildUserContext(appliances, dashboard, budget);
  const prompt = prompts.budgetPrompt(context);
  const result = await callGemini(prompt);

  setCache(cacheKey, result);
  return result;
}

module.exports = {
  chat,
  generateInsights,
  generateMonthlyReport,
  generateAlerts,
  budgetAdvice,
  invalidateUser,
};
