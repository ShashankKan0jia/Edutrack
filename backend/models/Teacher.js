const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherId: {
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
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  school: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  class: {
    type: String,
    required: true, // class teacher of which class
    trim: true,
    maxlength: 100,
  },
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
