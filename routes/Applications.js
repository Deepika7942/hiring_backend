const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// 📌 Submit Application (User Form)
router.post("/", async (req, res) => {
  try {
    const applicationData = req.body;
    const newApplication = new Application(applicationData);
    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 📌 Get All Applications (Admin Dashboard)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
