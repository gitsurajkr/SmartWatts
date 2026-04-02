const SYSTEM_CONTEXT = `You are SmartWatts AI Advisor — an intelligent energy optimization assistant built into the SmartWatts electricity monitoring app. You analyze real appliance usage data and provide personalized, data-driven advice.

Rules:
- Always reference the user's actual data (appliance names, watts, hours, costs) in your responses.
- Be concise and actionable. No filler text.
- Use Indian Rupee (₹) for all currency.
- Use kWh for energy units.
- Do NOT perform raw math yourself — the app provides pre-calculated values. Reference them directly.
- When suggesting savings, always explain which appliance and what change produces the saving.
- Be warm but professional. Speak like a smart energy consultant, not a generic chatbot.`;

function formatContext(ctx) {
  let text = `\n--- USER'S ENERGY DATA ---
Monthly Bill: ₹${ctx.monthlyBill}
Total Units: ${ctx.totalUnits} kWh
Rate: ₹${ctx.ratePerUnit}/kWh
Active Devices: ${ctx.activeDevices} of ${ctx.totalDevices}`;

  if (ctx.topAppliance) {
    text += `\nTop Consumer: ${ctx.topAppliance} (${ctx.topApplianceUnits} kWh, ${ctx.topAppliancePercentage}%)`;
  }
  if (ctx.estimatedSavings > 0) {
    text += `\nEstimated Savings: ₹${ctx.estimatedSavings}/month`;
    if (ctx.savingsTip) text += ` — ${ctx.savingsTip}`;
  }
  if (ctx.budget) {
    text += `\nMonthly Budget: ₹${ctx.budget}`;
    const diff = ctx.monthlyBill - ctx.budget;
    if (diff > 0) {
      text += ` (OVER BUDGET by ₹${Math.round(diff)})`;
    } else {
      text += ` (Under budget by ₹${Math.round(Math.abs(diff))})`;
    }
  }
  if (ctx.appliances && ctx.appliances.length > 0) {
    text += '\n\nAppliance Breakdown:';
    ctx.appliances.forEach((a) => {
      text += `\n  - ${a.name}: ${a.watts}W, ${a.hoursPerDay}h/day, ${a.daysPerWeek}d/week → ${a.monthlyUnits} kWh (₹${a.monthlyCost}/mo, ${a.percentage}%) [${a.status}]`;
    });
  }
  text += '\n--- END DATA ---\n';
  return text;
}

function chatPrompt(ctx, userMessage) {
  return `${SYSTEM_CONTEXT}
${formatContext(ctx)}

User asks: "${userMessage}"

Provide a helpful, personalized response. Reference specific appliances and numbers from the data above. Keep your response under 150 words. If the user asks a what-if question, explain the impact clearly using their actual data.`;
}

function insightsPrompt(ctx) {
  return `${SYSTEM_CONTEXT}
${formatContext(ctx)}

Generate 3 smart energy insights based on this user's data. Each insight should be specific, actionable, and reference actual appliance names and numbers.

Return ONLY a JSON array with this exact format, no other text:
[
  {"type": "warning|tip|info", "message": "Your insight text here", "severity": "high|medium|low"}
]

Types: "warning" for cost concerns, "tip" for savings opportunities, "info" for general observations.`;
}

function monthlyReportPrompt(ctx) {
  return `${SYSTEM_CONTEXT}
${formatContext(ctx)}

Write a brief monthly energy report (100-150 words) for this user. Include:
1. Total consumption summary
2. Which appliance dominates usage and by how much
3. One specific, actionable recommendation
4. Projected next month outlook

Tone: professional energy consultant. Reference actual numbers.`;
}

function alertsPrompt(ctx) {
  return `${SYSTEM_CONTEXT}
${formatContext(ctx)}

Analyze this user's energy data for any concerning patterns. Generate 0-3 proactive alerts.

Consider:
- High-wattage appliances running many hours
- Any device consuming >40% of total
- Budget overruns
- Devices that could be optimized

Return ONLY a JSON array (empty array if no alerts):
[
  {"type": "spike|budget|efficiency", "title": "Short alert title", "message": "Detailed alert message with data", "severity": "high|medium|low"}
]`;
}

function budgetPrompt(ctx) {
  return `${SYSTEM_CONTEXT}
${formatContext(ctx)}

The user has set a monthly budget of ₹${ctx.budget}. Their current projected bill is ₹${ctx.monthlyBill}.

${ctx.monthlyBill > ctx.budget
    ? `They are OVER budget by ₹${Math.round(ctx.monthlyBill - ctx.budget)}. Provide specific, appliance-level recommendations to bring their bill under ₹${ctx.budget}. For each suggestion, mention the exact savings in ₹ and kWh.`
    : `They are within budget. Provide tips to maintain this and identify any optimization opportunities.`
  }

Keep response under 120 words. Be specific with appliance names and numbers.`;
}

module.exports = {
  chatPrompt,
  insightsPrompt,
  monthlyReportPrompt,
  alertsPrompt,
  budgetPrompt,
};
