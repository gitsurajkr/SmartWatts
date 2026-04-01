const mongoose = require("mongoose");

const applianceSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    applianceName: {
        type: String,
        required: true
    },
    hoursPerDay: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Appliance", applianceSchema);