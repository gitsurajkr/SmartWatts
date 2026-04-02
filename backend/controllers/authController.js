const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateSignup, validateLogin } = require('../validators/authValidator');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function signup(req, res) {
  const { valid, errors } = validateSignup(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email already registered' });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    },
  });
}

async function login(req, res) {
  const { valid, errors } = validateLogin(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    },
  });
}

async function getMe(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    data: { _id: user._id, name: user.name, email: user.email },
  });
}

module.exports = { signup, login, getMe };
