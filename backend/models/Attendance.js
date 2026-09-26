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

// Prevent duplicate teacher attendance records for the same day.
attendanceSchema.index(
  { userType: 1, userId: 1, date: 1 },
  {
    unique: true,
    partialFilterExpression: { userType: "teacher" },
  },
);

module.exports = mongoose.model("Attendance", attendanceSchema);

// Prevent duplicate student attendance records for the same day.
attendanceSchema.index(
  { userType: 1, userId: 1, date: 1 },
  {
    unique: true,
    partialFilterExpression: { userType: "student" },
  },
);
