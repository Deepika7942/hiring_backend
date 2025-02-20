const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// ✅ Middleware



// ✅ Alternative: Allow all origins (for development only)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
const MONGODB_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
// Initialize GridFS
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

// GridFS Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads"
    })
});
const upload = multer({ storage });

// ✅ Schema & Model
const ApplicationSchema = new mongoose.Schema({
  application_id: { type: String, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  position: String,
  education: String,
  college_name: String,
  specialization: String,
  cgpa_or_percentage: String,
  graduation_year: String,
  skills: String,
  has_personal_computer: String,
  preferred_start_date: String,
  available_hours_per_week: String,
  resume: String,
  status: { type: String, default: "Pending" },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

// File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// ✅ Define the submit-form POST route

app.post("/submit-form", upload.single("resume"), async (req, res) => {
  try {
    console.log("Form received:", req.body);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is missing" });
    }

    const application_id = new mongoose.Types.ObjectId().toString();

    const newApplication = new Application({
      application_id,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      education: req.body.education,
      college_name: req.body.college_name,
      specialization: req.body.specialization,
      cgpa_or_percentage: req.body.cgpa_or_percentage,
      graduation_year: req.body.graduation_year,
      skills: req.body.skills,
      has_personal_computer: req.body.has_personal_computer,
      preferred_start_date: req.body.preferred_start_date,
      available_hours_per_week: req.body.available_hours_per_week,
      resume: req.file.filename,
      status: "Pending",
    });

    // ✅ Save to MongoDB & log success
    await newApplication.save();
    console.log("✅ Application saved to MongoDB:", newApplication);

    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("❌ Error saving application:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// ✅ Update application status
app.put("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find and update the application
    await Application.findByIdAndUpdate(id, { status });

    res.status(200).json({ message: "✅ Application status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to update application status" });
  }
});

// ✅ Fetch All Applications
app.get('/api/applications', async (req, res) => {
  const { search } = req.query;
  try {
    let applications;
    if (search) {
      applications = await Application.find({
        fullname: { $regex: search, $options: 'i' } // Case insensitive search
      });
    } else {
      applications = await Application.find();
    }
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});


// ✅ Fetch Accepted Applications
app.get("/api/applications/accepted", async (req, res) => {
  try {
    const acceptedApps = await Application.find({ status: "Accepted" });
    res.json(acceptedApps);
  } catch (error) {
    console.error("❌ Error fetching accepted applications:", error);
    res.status(500).json({ message: "❌ Server error, unable to fetch data" });
  }
});
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});
// ✅ Fetch Rejected Applications
app.get("/api/applications/rejected", async (req, res) => {
  try {
    const rejectedApps = await Application.find({ status: "Rejected" });
    res.json(rejectedApps);
  } catch (error) {
    console.error("❌ Error fetching rejected applications:", error);
    res.status(500).json({ message: "❌ Server error, unable to fetch data" });
  }
});
// ✅ Update application status
app.put("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedApp = await Application.findOneAndUpdate(
      { application_id: id },
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: "❌ Application not found!" });
    }

    res.status(200).json({ message: "✅ Application status updated successfully", application: updatedApp });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to update application status" });
  }
});

// ✅ Fetch Accepted Applications
app.get("/api/applications/accepted", async (req, res) => {
  try {
    const acceptedApps = await Application.find({ status: "Accepted" });
    res.json(acceptedApps);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error, unable to fetch data" });
  }
});

// ✅ Fetch Rejected Applications
app.get("/api/applications/rejected", async (req, res) => {
  try {
    const rejectedApps = await Application.find({ status: "Rejected" });
    res.json(rejectedApps);
  } catch (error) {
    res.status(500).json({ message: "❌ Server error, unable to fetch data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});