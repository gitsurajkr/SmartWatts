/**
 * Validate appliance input data
 * Returns { valid: boolean, errors: string[] }
 */
function validateAppliance(data) {
  const errors = [];

  // Name
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.trim().length > 50) {
    errors.push('Name must be 50 characters or fewer');
  }

  // Watts
  if (data.watts === undefined || data.watts === null || data.watts === '') {
    errors.push('Watts (power rating) is required');
  } else {
    const watts = Number(data.watts);
    if (isNaN(watts) || watts < 1 || watts > 50000) {
      errors.push('Watts must be between 1 and 50,000');
    }
  }

  // Hours per day
  if (data.hoursPerDay === undefined || data.hoursPerDay === null || data.hoursPerDay === '') {
    errors.push('Hours per day is required');
  } else {
    const hours = Number(data.hoursPerDay);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      errors.push('Hours per day must be between 0 and 24');
    }
  }

  // Days per week
  if (data.daysPerWeek === undefined || data.daysPerWeek === null || data.daysPerWeek === '') {
    errors.push('Days per week is required');
  } else {
    const days = Number(data.daysPerWeek);
    if (isNaN(days) || days < 1 || days > 7) {
      errors.push('Days per week must be between 1 and 7');
    }
  }

  // Status (optional, defaults handled by model)
  if (data.status && !['active', 'standby'].includes(data.status)) {
    errors.push('Status must be "active" or "standby"');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = { validateAppliance };
