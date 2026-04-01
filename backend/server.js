const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Bill = require("./models/Bill");
const Appliance = require("./models/Appliance");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("SmartWatts backend running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.post("/add-bill", async (req, res) => {
    try {
        const { month, totalBill } = req.body;

        const newBill = new Bill({
            month,
            totalBill
        });

        await newBill.save();

        res.status(200).json("Bill saved successfully ✅");

    } catch (error) {
        res.status(500).json("Error saving bill");
    }
});

app.post("/add-appliance", async (req, res) => {
    try {
        const { month, applianceName, hoursPerDay } = req.body;

        const newAppliance = new Appliance({
            month,
            applianceName,
            hoursPerDay
        });

        await newAppliance.save();

        res.status(200).json("Appliance usage saved ✅");

    } catch (error) {
        res.status(500).json("Error saving appliance usage");
    }
});

app.get("/compare-bills", async (req, res) => {
    try {

        const bills = await Bill.find().sort({ _id: -1 }).limit(2);

        if (bills.length < 2) {
            return res.json("Not enough data to compare");
        }

        const latest = bills[0];
        const previous = bills[1];

        let difference = latest.totalBill - previous.totalBill;

        let message = "";

        if (difference > 0) {
            message = `Bill increased by ₹${difference}`;
        } 
        else if (difference < 0) {
            message = `Bill decreased by ₹${Math.abs(difference)}`;
        } 
        else {
            message = "Bill stayed the same";
        }

        // appliance comparison logic

        const latestAppliances = await Appliance.find({ month: latest.month });
        const previousAppliances = await Appliance.find({ month: previous.month });

        let reason = "No major appliance change detected";

        latestAppliances.forEach(current => {

            const match = previousAppliances.find(prev =>
                prev.applianceName === current.applianceName
            );

            if (match && current.hoursPerDay > match.hoursPerDay) {
                reason = `${current.applianceName} usage increased`;
            }

        });

        res.json({
            latestMonth: latest.month,
            previousMonth: previous.month,
            message,
            reason
        });

    } catch (error) {
        res.status(500).json("Comparison failed");
    }
});