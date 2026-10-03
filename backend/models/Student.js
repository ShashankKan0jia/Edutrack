const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  class: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  school: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
});

module.exports = mongoose.model("Student", studentSchema);
