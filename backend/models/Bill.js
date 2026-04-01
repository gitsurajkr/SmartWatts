const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    totalBill: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Bill", billSchema);