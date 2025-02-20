const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Application = require("../models/Application");

const router = express.Router();

// 📌 Configure Multer for Resume Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 📌 Submit Application (User Form)
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { email } = req.body;

    // Check for duplicate email
    const existingApplication = await Application.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({ message: "This email is already used. Try a different one!" });
    }

    const applicationData = req.body;
    if (req.file) {
      applicationData.resume = req.file.filename; // Store filename in DB
    }

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

// 📌 Download Resume API
router.get("/resume/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }
  
  res.download(filePath);
});

// 📌 Update Application Status (Accept/Reject)
router.post("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});
// ✅ Get Accepted Applications
router.get("/applications/accepted", async (req, res) => {
  try {
    const acceptedApplications = await Application.find({ status: "accepted" });
    res.json(acceptedApplications);
  } catch (error) {
    console.error("Error fetching accepted applications:", error);
    res.status(500).json({ error: "Server error! Please try again." });
  }
});

// ✅ Get Rejected Applications
router.get("/applications/rejected", async (req, res) => {
  try {
    const rejectedApplications = await Application.find({ status: "rejected" });
    res.json(rejectedApplications);
  } catch (error) {
    console.error("Error fetching rejected applications:", error);
    res.status(500).json({ error: "Server error! Please try again." });
  }
});

module.exports = router;
