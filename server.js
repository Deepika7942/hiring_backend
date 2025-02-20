const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const app = express();

app.use(cors());

// ✅ Alternative: Allow all origins (for development only)

// ✅ Import applications route
const applicationRoutes = require("./routes/Applications");

// ✅ Use the route with `/api/applications`
app.use("/api", applicationRoutes);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});
// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ MongoDB Connection
const MONGODB_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI, {  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  res.json({ message: "File uploaded successfully!", file: req.file });
});


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


app.post("/api/applications", async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
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


app.get("/api/applications", async (req, res) => {
  console.log("API Hit: /api/applications"); // Debugging
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications." });
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

module.exports = app;  // Important for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
