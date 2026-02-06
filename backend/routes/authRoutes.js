const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// LOGIN
router.post("/login", authController.login);

// ADMIN
router.post("/add-teacher", authController.addTeacher);
router.post("/add-student", authController.addStudent);

// TEACHER ATTENDANCE
router.post("/mark-teacher-attendance", authController.markTeacherAttendance);

// GET STUDENTS
router.get("/students", authController.getStudentsByClassAndSchool);

// FINAL STUDENT ATTENDANCE
router.post(
  "/mark-student-attendance-bulk",
  authController.markStudentAttendanceBulk,
);

module.exports = router;
