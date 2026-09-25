const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: String,
    required: true, // class teacher of which class
    trim: true,
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
