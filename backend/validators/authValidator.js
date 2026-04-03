function validateSignup(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Name is required');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must be 100 characters or fewer');
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    errors.push('Please provide a valid email');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return { valid: errors.length === 0, errors };
}

function validateLogin(data) {
  const errors = [];

  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('Email is required');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateSignup, validateLogin };
