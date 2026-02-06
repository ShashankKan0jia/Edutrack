const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userType: {
    type: String, // "teacher" or "student"
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: String,
  school: String,
  class: String,
  date: String,
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present",
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
