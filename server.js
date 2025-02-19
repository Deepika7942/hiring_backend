// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");

// const app = express();

// app.use(cors());

// // ✅ Middleware
// // app.use(
// //   cors({
// //     origin: ["http://localhost:5000", "https://your-vercel-app.vercel.app"], // ✅ Allow both local and Vercel
// //     methods: ["POST", "GET", "PUT"],
// //     allowedHeaders: ["Content-Type"],
// //   })
// // );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));

// // ✅ MongoDB Connection
// const MONGO_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // ✅ Schema & Model
// const ApplicationSchema = new mongoose.Schema({
//   application_id: { type: String, unique: true },
//   fullname: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   phone: { type: String, required: true },
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
//   status: { type: String, default: "Pending" }, // ✅ Status defaults to "Pending"
// });

// const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

// // ✅ Generate Custom ID Function
// const generateCustomId = async () => {
//   const lastApplication = await Application.findOne().sort({ _id: -1 });
//   if (!lastApplication) return "PSI2024001";
  
//   const lastId = lastApplication.application_id.replace("PSI2024", "");
//   const newId = "PSI2024" + String(parseInt(lastId) + 1).padStart(3, "0");
//   return newId;
// };

// // ✅ Default Route (Fix for "Cannot GET /")
// app.get("/", (req, res) => {
//   res.send("🚀 API is running!");
// });

// // ✅ API Route for Form Submission
// app.post("/api/submit-form", upload.single("resume"), async (req, res) => {
//   try {
//     console.log("📩 Received Data:", req.body);

//     const existingUser = await Application.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res.status(409).json({ message: "❌ Application already submitted with this email!" });
//     }

//     const newId = await generateCustomId();

//     const newApplication = new Application({
//       application_id: newId,
//       ...req.body,
//       resume: req.file ? `/uploads/${req.file.filename}` : "",
//     });

//     await newApplication.save();
//     res.status(201).json({ message: "✅ Application submitted successfully!" });
//   } catch (error) {
//     console.error("❌ Error submitting form:", error);
//     res.status(500).json({ message: "❌ Server error. Try again later." });
//   }
// });
// //POST routes
// app.post("/api/apply", async (req, res) => {
//   try {
//     const application = new Application(req.body);
//     await application.save();
//     res.status(201).json({ message: "Application submitted!" });
//   } catch (error) {
//     res.status(500).json({ error: "Submission failed" });
//   }
// });

// // ✅ Update Application Status
// app.put("/api/applications/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     await Application.findByIdAndUpdate(id, { status });

//     res.status(200).json({ message: "✅ Application status updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "❌ Failed to update application status" });
//   }
// });

// // ✅ Fetch All Applications
// app.get("/api/applications", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (error) {
//     console.error("❌ Error fetching dashboard data:", error);
//     res.status(500).json({ message: "❌ Server error, unable to fetch data" });
//   }
// });

// // ✅ Fetch Accepted Applications
// app.get("/api/applications/accepted", async (req, res) => {
//   try {
//     const acceptedApps = await Application.find({ status: "Accepted" });
//     res.json(acceptedApps);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error, unable to fetch data" });
//   }
// });

// // ✅ Fetch Rejected Applications
// app.get("/api/applications/rejected", async (req, res) => {
//   try {
//     const rejectedApps = await Application.find({ status: "Rejected" });
//     res.json(rejectedApps);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error, unable to fetch data" });
//   }
// });

// // ✅ Update Application Status (Accept/Reject)
// app.post("/api/update-status/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status || (status !== "Accepted" && status !== "Rejected")) {
//       return res.status(400).json({ message: "❌ Invalid status! Use 'Accepted' or 'Rejected'." });
//     }

//     const updatedApp = await Application.findOneAndUpdate(
//       { application_id: id },
//       { status },
//       { new: true }
//     );

//     if (!updatedApp) {
//       return res.status(404).json({ message: "❌ Application not found!" });
//     }

//     res.json({ message: `✅ Application updated to ${status}`, application: updatedApp });

//   } catch (error) {
//     res.status(500).json({ message: "❌ Server error, unable to update status" });
//   }
// });
// // Fetch all applications
// app.get("/applications", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

// // Fetch all applications
// app.get("/applications", async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch applications" });
//   }
// });

// // Fetch only accepted applications
// app.get("/applications/accepted", async (req, res) => {
//   try {
//     const acceptedApps = await Application.find({ status: "Accepted" });
//     res.json(acceptedApps);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch accepted applications" });
//   }
// });

// // Fetch only rejected applications
// app.get("/applications/rejected", async (req, res) => {
//   try {
//     const rejectedApps = await Application.find({ status: "Rejected" });
//     res.json(rejectedApps);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch rejected applications" });
//   }
// });

// // Update application status (Accept/Reject)
// app.put("/applications/:id/status", async (req, res) => {
//   const { status } = req.body;
//   try {
//     const updatedApplication = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     res.json(updatedApplication);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update application status" });
//   }
// });



// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());

// ✅ Middleware



// ✅ Alternative: Allow all origins (for development only)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
const MONGODB_URI = "mongodb+srv://deepikamashetty79:Deepika7912@cluster0.9jrfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
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
  status: { type: String, default: "Pending" },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);



// ✅ Define the submit-form POST route
const applications = []; // Temporary in-memory storage

app.post("/submit-form", upload.single("resume"), (req, res) => {
  try {
    console.log("Form received:", req.body);
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is missing" });
    }

    const newApplication = { ...req.body, resume: req.file.filename };
    applications.push(newApplication); // Store data

    res.json({ message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find(); // Ensure 'Application' is correctly imported
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
