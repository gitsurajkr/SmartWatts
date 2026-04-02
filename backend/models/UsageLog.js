const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    appliance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance',
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    unitsConsumed: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by date range
usageLogSchema.index({ weekStartDate: -1 });
usageLogSchema.index({ appliance: 1, weekStartDate: -1 });

module.exports = mongoose.model('UsageLog', usageLogSchema);
