const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Teacher = require("../models/Teacher");

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const teacherId =
      typeof req.body.teacherId === "string" ? req.body.teacherId.trim() : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

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
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= ADD TEACHER =================
exports.addTeacher = async (req, res) => {
  try {
    const teacherId = req.body.teacherId?.trim();
    const name = req.body.name?.trim();
    const password = req.body.password;
    const school = req.body.school?.trim();
    const teacherClass = req.body.class?.trim();

    if (!teacherId || !name || !password || !school || !teacherClass) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (
      teacherId.length > 100 ||
      name.length > 100 ||
      password.length > 200 ||
      school.length > 100 ||
      teacherClass.length > 100
    ) {
      return res.status(400).json({ message: "One or more fields are too long" });
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
      teacher: {
        teacherId: teacher.teacherId,
        name: teacher.name,
        school: teacher.school,
        class: teacher.class,
      },
    });
  } catch (error) {
    console.error("Add teacher error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= ADD STUDENT =================
exports.addStudent = async (req, res) => {
  try {
    const studentId = req.body.studentId?.trim();
    const name = req.body.name?.trim();
    const studentClass = req.body.class?.trim();
    const school = req.body.school?.trim();

    if (!studentId || !name || !studentClass || !school) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (
      studentId.length > 100 ||
      name.length > 100 ||
      studentClass.length > 100 ||
      school.length > 200
    ) {
      return res.status(400).json({ message: "One or more fields are too long" });
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
    console.error("Add student error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= MARK TEACHER ATTENDANCE =================
exports.markTeacherAttendance = async (req, res) => {
  try {
    const teacherId = req.body.teacherId?.trim();

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId is required",
      });
    }

    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

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
      name: teacher.name,
      school: teacher.school,
      class: teacher.class,
      date: today,
      status: "Present",
    });

    res.status(201).json({ message: "Attendance marked", record });
  } catch (error) {
    console.error("Mark teacher attendance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= GET STUDENTS OF CLASS =================
exports.getStudentsByClassAndSchool = async (req, res) => {
  try {
    const className =
      typeof req.query.className === "string" ? req.query.className.trim() : "";
    const school =
      typeof req.query.school === "string" ? req.query.school.trim() : "";

    if (!className || !school) {
      return res.status(400).json({ message: "className and school required" });
    }

    if (className.length > 100 || school.length > 200) {
      return res.status(400).json({
        message: "Class or school exceeds the allowed length",
      });
    }

    const students = await Student.find({
      class: className,
      school,
    });

    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================= BULK STUDENT ATTENDANCE =================
exports.markStudentAttendanceBulk = async (req, res) => {
  try {
    const school = req.body.school?.trim();
    const className = req.body.className?.trim();
    const { students } = req.body;

    if (!school || !className || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        message: "school, className and a non-empty students array are required",
      });
    }

    if (school.length > 200 || className.length > 100 || students.length > 200) {
      return res.status(400).json({
        message: "School, class, or student list exceeds the allowed limit",
      });
    }

    const invalidStudent = students.find(
      (s) =>
        !s ||
        typeof s.studentId !== "string" ||
        typeof s.name !== "string" ||
        !s.studentId.trim() ||
        !s.name.trim() ||
        s.studentId.trim().length > 100 ||
        s.name.trim().length > 100 ||
        !["Present", "Absent"].includes(s.status),
    );

    if (invalidStudent) {
      return res.status(400).json({
        message: "Each student must include valid studentId, name and status",
      });
    }

    const studentIds = students.map((student) => student.studentId.trim());
    if (new Set(studentIds).size !== studentIds.length) {
      return res.status(400).json({
        message: "Each student can appear only once in an attendance submission",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // 🔒 CLASS LEVEL LOCK CHECK
    const alreadySubmitted = await Attendance.findOne({
      userType: "student",
      school,
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
      userId: s.studentId.trim(),
      name: s.name.trim(),
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
    console.error("Bulk student attendance error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
