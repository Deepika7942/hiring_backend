const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Connect to MongoDB
const MONGODB_URI = process.env.MONGO_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware and routes
app.use(express.json());
app.get("/api/applications", async (req, res) => {
  // Your GET logic
});
app.put("/api/applications/:id", async (req, res) => {
  // Your PUT logic
});

// Export the Express app as a serverless function using vercel-express adapter
const serverless = require("vercel-express");
module.exports = serverless(app);
