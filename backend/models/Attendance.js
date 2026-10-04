const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["teacher", "student"],
    required: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  school: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  class: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  date: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
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

// Prevent duplicate student attendance records for the same day.
attendanceSchema.index(
  { userType: 1, userId: 1, date: 1 },
  {
    unique: true,
    partialFilterExpression: { userType: "student" },
  },
);

module.exports = mongoose.model("Attendance", attendanceSchema);
