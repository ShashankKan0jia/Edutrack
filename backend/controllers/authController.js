const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Teacher = require("../models/Teacher");

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res
        .status(400)
        .json({ message: "Teacher ID and Password required" });
    }

    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      teacher: {
        teacherId: teacher.teacherId,
        name: teacher.name,
        school: teacher.school,
        class: teacher.class,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADD TEACHER =================
exports.addTeacher = async (req, res) => {
  try {
    const { teacherId, name, password, school, class: teacherClass } = req.body;

    if (!teacherId || !name || !password || !school || !teacherClass) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Teacher.findOne({ teacherId });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const teacher = await Teacher.create({
      teacherId,
      name,
      password,
      school,
      class: teacherClass,
    });

    res.status(201).json({
      message: "Teacher added",
      teacher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADD STUDENT =================
exports.addStudent = async (req, res) => {
  try {
    const { studentId, name, class: studentClass, school } = req.body;

    if (!studentId || !name || !studentClass || !school) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Student.findOne({ studentId });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const student = await Student.create({
      studentId,
      name,
      class: studentClass,
      school,
    });

    res.status(201).json({
      message: "Student added",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK TEACHER ATTENDANCE =================
exports.markTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, name, school, class: teacherClass } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const exists = await Attendance.findOne({
      userType: "teacher",
      userId: teacherId,
      date: today,
    });

    if (exists) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const record = await Attendance.create({
      userType: "teacher",
      userId: teacherId,
      name,
      school,
      class: teacherClass,
      date: today,
      status: "Present",
    });

    res.status(201).json({ message: "Attendance marked", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET STUDENTS OF CLASS =================
exports.getStudentsByClassAndSchool = async (req, res) => {
  try {
    const { className, school } = req.query;

    if (!className || !school) {
      return res.status(400).json({ message: "className and school required" });
    }

    const students = await Student.find({
      class: className,
      school,
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= BULK STUDENT ATTENDANCE =================
exports.markStudentAttendanceBulk = async (req, res) => {
  try {
    const { students, school, className } = req.body;
    const today = new Date().toISOString().split("T")[0];

    // 🔒 CLASS LEVEL LOCK CHECK
    const alreadySubmitted = await Attendance.findOne({
      userType: "student",
      class: className,
      date: today,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "Attendance already submitted for today. Editing not allowed.",
      });
    }

    const records = students.map((s) => ({
      userType: "student",
      userId: s.studentId,
      name: s.name,
      school,
      class: className,
      date: today,
      status: s.status,
    }));

    await Attendance.insertMany(records);

    res.json({
      message: "Student attendance submitted successfully",
      count: records.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
