const Appliance = require('../models/Appliance');
const { validateAppliance } = require('../validators/applianceValidator');
const { calculateMonthlyUnits, calculateBill } = require('../services/calculationService');
const { invalidateUser } = require('../services/aiService');

async function getAll(req, res) {
  const appliances = await Appliance.find({ userId: req.user.id }).sort({ createdAt: -1 });

  const result = appliances.map((app) => {
    const monthlyUnits = calculateMonthlyUnits(app.watts, app.hoursPerDay, app.daysPerWeek);
    return {
      ...app.toObject(),
      monthlyUnits: Math.round(monthlyUnits * 100) / 100,
      monthlyCost: Math.round(calculateBill(monthlyUnits) * 100) / 100,
    };
  });

  res.json({ success: true, data: result });
}

async function create(req, res) {
  const { valid, errors } = validateAppliance(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  const { name, watts, hoursPerDay, daysPerWeek, status } = req.body;

  const appliance = await Appliance.create({
    userId: req.user.id,
    name: name.trim(),
    watts: Number(watts),
    hoursPerDay: Number(hoursPerDay),
    daysPerWeek: Number(daysPerWeek),
    status: status || 'active',
  });

  const monthlyUnits = calculateMonthlyUnits(appliance.watts, appliance.hoursPerDay, appliance.daysPerWeek);

  invalidateUser(req.user.id);

  res.status(201).json({
    success: true,
    data: {
      ...appliance.toObject(),
      monthlyUnits: Math.round(monthlyUnits * 100) / 100,
      monthlyCost: Math.round(calculateBill(monthlyUnits) * 100) / 100,
    },
  });
}

async function update(req, res) {
  const { valid, errors } = validateAppliance(req.body);
  if (!valid) {
    return res.status(400).json({ success: false, errors });
  }

  const { name, watts, hoursPerDay, daysPerWeek, status } = req.body;

  const appliance = await Appliance.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    {
      name: name.trim(),
      watts: Number(watts),
      hoursPerDay: Number(hoursPerDay),
      daysPerWeek: Number(daysPerWeek),
      status: status || 'active',
    },
    { new: true, runValidators: true }
  );

  if (!appliance) {
    return res.status(404).json({ success: false, error: 'Appliance not found' });
  }

  const monthlyUnits = calculateMonthlyUnits(appliance.watts, appliance.hoursPerDay, appliance.daysPerWeek);

  invalidateUser(req.user.id);

  res.json({
    success: true,
    data: {
      ...appliance.toObject(),
      monthlyUnits: Math.round(monthlyUnits * 100) / 100,
      monthlyCost: Math.round(calculateBill(monthlyUnits) * 100) / 100,
    },
  });
}

async function remove(req, res) {
  const appliance = await Appliance.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!appliance) {
    return res.status(404).json({ success: false, error: 'Appliance not found' });
  }

  invalidateUser(req.user.id);

  res.json({ success: true, message: 'Appliance deleted' });
}

module.exports = { getAll, create, update, remove };
