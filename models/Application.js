const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    education: { type: String, required: true },
    college_name: { type: String, required: true },
    specialization: { type: String, required: true },
    cgpa_or_percentage: { type: String, required: true },
    graduation_year: { type: String, required: true },
    skills: { type: String, required: true },
    has_personal_computer: { type: String, required: true },
    preferred_start_date: { type: String, required: true },
    available_hours_per_week: { type: String, required: true },
    resume: { type: String, required: true }, // Path to the uploaded file
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
