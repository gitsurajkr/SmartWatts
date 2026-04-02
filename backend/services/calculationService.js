/**
 * SmartWatts Calculation Service
 * 
 * Core business logic for electricity consumption calculations.
 * 
 * Formula:
 *   monthlyUnits = (watts × hoursPerDay × daysPerWeek × 4) / 1000
 *   monthlyBill  = monthlyUnits × RATE_PER_UNIT
 */

const RATE_PER_UNIT = 8; // ₹8 per kWh (Indian electricity rate)
const WEEKS_PER_MONTH = 4;

/**
 * Calculate monthly units consumed by a single appliance
 */
function calculateMonthlyUnits(watts, hoursPerDay, daysPerWeek) {
  return (watts * hoursPerDay * daysPerWeek * WEEKS_PER_MONTH) / 1000;
}

/**
 * Calculate weekly units consumed by a single appliance
 */
function calculateWeeklyUnits(watts, hoursPerDay, daysPerWeek) {
  return (watts * hoursPerDay * daysPerWeek) / 1000;
}

/**
 * Calculate monthly bill from units
 */
function calculateBill(units) {
  return units * RATE_PER_UNIT;
}

/**
 * Calculate savings estimate if top appliance reduces usage by 1 hour
 */
function calculateSavings(topAppliance) {
  if (!topAppliance) return { units: 0, amount: 0, tip: '' };

  const currentUnits = calculateMonthlyUnits(
    topAppliance.watts,
    topAppliance.hoursPerDay,
    topAppliance.daysPerWeek
  );
  const reducedUnits = calculateMonthlyUnits(
    topAppliance.watts,
    Math.max(0, topAppliance.hoursPerDay - 1),
    topAppliance.daysPerWeek
  );
  const savedUnits = currentUnits - reducedUnits;
  const savedAmount = calculateBill(savedUnits);

  return {
    units: Math.round(savedUnits * 100) / 100,
    amount: Math.round(savedAmount * 100) / 100,
    tip: `Reduce ${topAppliance.name} usage by 1 hour/day to save ₹${Math.round(savedAmount)}/month`,
  };
}

/**
 * Build full dashboard data from appliances list
 */
function buildDashboardData(appliances) {
  // Per-appliance breakdown
  const breakdown = appliances.map((app) => {
    const monthlyUnits = calculateMonthlyUnits(app.watts, app.hoursPerDay, app.daysPerWeek);
    const monthlyCost = calculateBill(monthlyUnits);
    return {
      _id: app._id,
      name: app.name,
      watts: app.watts,
      hoursPerDay: app.hoursPerDay,
      daysPerWeek: app.daysPerWeek,
      status: app.status,
      monthlyUnits: Math.round(monthlyUnits * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
    };
  });

  // Totals
  const totalUnits = breakdown.reduce((sum, b) => sum + b.monthlyUnits, 0);
  const totalBill = calculateBill(totalUnits);

  // Percentages
  breakdown.forEach((b) => {
    b.percentage = totalUnits > 0 ? Math.round((b.monthlyUnits / totalUnits) * 100) : 0;
  });

  // Top appliance (highest monthly units)
  const sorted = [...breakdown].sort((a, b) => b.monthlyUnits - a.monthlyUnits);
  const topAppliance = sorted[0] || null;

  // Savings calculation
  const topApplianceRaw = appliances.find(
    (a) => topAppliance && a._id.toString() === topAppliance._id.toString()
  );
  const savings = calculateSavings(topApplianceRaw);

  // Active devices count
  const activeDevices = appliances.filter((a) => a.status === 'active').length;

  return {
    totalUnits: Math.round(totalUnits * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    activeDevices,
    totalDevices: appliances.length,
    topAppliance: topAppliance
      ? {
          name: topAppliance.name,
          monthlyUnits: topAppliance.monthlyUnits,
          percentage: topAppliance.percentage,
        }
      : null,
    savings,
    breakdown,
    ratePerUnit: RATE_PER_UNIT,
  };
}

module.exports = {
  RATE_PER_UNIT,
  calculateMonthlyUnits,
  calculateWeeklyUnits,
  calculateBill,
  calculateSavings,
  buildDashboardData,
};
