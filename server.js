const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const app = express();

// ✅ Middleware

app.use(
  cors({
    origin: "*", // Allow all origins (or replace with frontend URL)
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
const MONGO_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
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
  status: { type: String, default: "Pending" }, // ✅ Status is now default "Pending"
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);


// ✅ Generate Custom ID Function
const generateCustomId = async () => {
  const lastApplication = await Application.findOne().sort({ _id: -1 });
  if (!lastApplication) return "PSI2024001";
  
  const lastId = lastApplication.application_id.replace("PSI2024", "");
  const newId = "PSI2024" + String(parseInt(lastId) + 1).padStart(3, "0");
  return newId;
};

// ✅ API Route for Form Submission (Without Status Field)
app.post("/submit-form", upload.single("resume"), async (req, res) => {
  try {
    console.log("📩 Received Data:", req.body);

    // ✅ Check if email already exists
    const existingUser = await Application.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("❌ Duplicate Email:", req.body.email);
      return res.status(409).json({ message: "❌ Application already submitted with this email!" });
    }

    // ✅ Generate Unique ID
    const newId = await generateCustomId();

    // ✅ Create & Save Application (without status field in request)
    const newApplication = new Application({
      application_id: newId,
      ...req.body,
      resume: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await newApplication.save();
    console.log("✅ Data Saved:", newApplication);
    res.status(201).json({ message: "✅ Application submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    res.status(500).json({ message: "❌ Server error. Try again later." });
  }
});

//PUT request for update the status
app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Find and update the application
    await Application.findByIdAndUpdate(id, { status });

    res.status(200).json({ message: "Application status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update application status" });
  }
});

// ✅ Fetch All Applications (Default)
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error, unable to fetch data" });
  }
});

// ✅ Fetch Accepted Applications
app.get("/api/applications/accepted", async (req, res) => {
  try {
    const acceptedApps = await Application.find({ status: "Accepted" });
    res.json(acceptedApps);
  } catch (error) {
    console.error("❌ Error fetching accepted applications:", error);
    res.status(500).json({ message: "Server error, unable to fetch data" });
  }
});

// ✅ Fetch Rejected Applications
app.get("/api/applications/rejected", async (req, res) => {
  try {
    const rejectedApps = await Application.find({ status: "Rejected" });
    res.json(rejectedApps);
  } catch (error) {
    console.error("❌ Error fetching rejected applications:", error);
    res.status(500).json({ message: "Server error, unable to fetch data" });
  }
});

// ✅ API Route to Update Application Status (Accept/Reject)
app.post("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Debugging: Log incoming data
    console.log(`📌 Updating status for ID: ${id} | New Status: ${status}`);

    if (!status || (status !== "Accepted" && status !== "Rejected")) {
      return res.status(400).json({ message: "❌ Invalid status! Use 'Accepted' or 'Rejected'." });
    }

    const updatedApp = await Application.findOneAndUpdate(
      { application_id: id },
      { status },
      { new: true }
    );

    if (!updatedApp) {
      console.log("❌ Application not found for ID:", id);
      return res.status(404).json({ message: "❌ Application not found!" });
    }

    console.log("✅ Status Updated:", updatedApp);
    res.json({ message: `✅ Application updated to ${status}`, application: updatedApp });

  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ message: "❌ Server error, unable to update status" });
  }
});
// Fetch all applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Fetch only accepted applications
router.get("/applications/accepted", async (req, res) => {
  try {
    const acceptedApps = await Application.find({ status: "Accepted" });
    res.json(acceptedApps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accepted applications" });
  }
});

// Fetch only rejected applications
router.get("/applications/rejected", async (req, res) => {
  try {
    const rejectedApps = await Application.find({ status: "Rejected" });
    res.json(rejectedApps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rejected applications" });
  }
});

// Update application status (Accept/Reject)
router.put("/applications/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedApplication);
  } catch (err) {
    res.status(500).json({ error: "Failed to update application status" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
