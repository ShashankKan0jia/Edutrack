const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true, // class teacher of which class
  },
});

module.exports = mongoose.model("Teacher", teacherSchema);
