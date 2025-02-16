const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ MongoDB Atlas Connection
const MONGO_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // 🔹 Replace with your Atlas URI
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
  resume: String, // ✅ Store file path instead of full file object
});
const Application = mongoose.model("Application", ApplicationSchema);

// ✅ API Route for Form Submission
app.post("/submit-form", upload.single("resume"), async (req, res) => {
  try {
    console.log("📩 Received Data:", req.body);

    // ✅ Check if email already exists
    const existingUser = await Application.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("❌ Duplicate Email:", req.body.email);
      return res.status(409).json({ message: "❌ Application already submitted with this email!" });
    }

    // ✅ Create & Save Application
    const newApplication = new Application({
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

// ✅ Default Route for Server Testing
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json()); // ✅ This allows backend to parse JSON data
// app.use(express.urlencoded({ extended: true })); // ✅ For form submissions

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/hiring", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("✅ MongoDB Connected")).catch(err => console.error(err));

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Schema & Model
// const ApplicationSchema = new mongoose.Schema({
//   fullname: String,
//   email: String,
//   phone: String,
//   position: String,
//   education: String,
//   college_name: String,
//   specialization: String,
//   cgpa_or_percentage: String,
//   graduation_year: String,
//   skills: String,
//   has_personal_computer: String,
//   preferred_start_date: String,
//   available_hours_per_week: String,
//   resume: String,
// });
// const Application = mongoose.model("Application", ApplicationSchema);

// // ✅ API Route for Form Submission
// app.post("/submit-form", upload.single("resume"), async (req, res) => {
//   try {
//     console.log("📩 Received Data:", req.body);

//     // Check for duplicate email
//     const existingUser = await Application.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Duplicate email! Application already submitted." });
//     }

//     // Save new application
//     const newApplication = new Application({
//       ...req.body,
//       resume: req.file ? req.file.filename : "",
//     });

//     await newApplication.save();
//     res.status(201).json({ message: "✅ Application submitted successfully!" });
//   } catch (error) {
//     console.error("❌ Error submitting form:", error);
//     res.status(500).json({ message: "Server error. Try again later." });
//   }
// });

// // ✅ Default Route to Test Server
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
