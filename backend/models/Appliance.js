const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Appliance name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    watts: {
      type: Number,
      required: [true, 'Power rating (watts) is required'],
      min: [1, 'Watts must be at least 1'],
      max: [50000, 'Watts cannot exceed 50,000'],
    },
    hoursPerDay: {
      type: Number,
      required: [true, 'Hours per day is required'],
      min: [0, 'Hours cannot be negative'],
      max: [24, 'Hours cannot exceed 24'],
    },
    daysPerWeek: {
      type: Number,
      required: [true, 'Days per week is required'],
      min: [1, 'Days must be at least 1'],
      max: [7, 'Days cannot exceed 7'],
    },
    status: {
      type: String,
      enum: ['active', 'standby'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appliance', applianceSchema);