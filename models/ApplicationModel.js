const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }
});

const ApplicationModel = mongoose.model("Application", applicationSchema);
module.exports = ApplicationModel;
