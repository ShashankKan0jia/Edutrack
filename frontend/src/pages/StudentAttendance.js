import { useEffect, useState } from "react";
import axios from "axios";

function StudentAttendance() {
  const teacher = JSON.parse(localStorage.getItem("teacher"));

  const [students, setStudents] = useState([]);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students?className=${teacher.class}&school=${teacher.school}`,
      );

      // default status = Present
      const formatted = res.data.map((s) => ({
        ...s,
        status: "Present",
      }));

      setStudents(formatted);
      setLoading(false);
    } catch (err) {
      alert("Failed to load students");
      setLoading(false);
    }
  };

  const changeStatus = (index, status) => {
    if (locked) return;

    const updated = [...students];
    updated[index].status = status;
    setStudents(updated);
  };

  const finalSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/mark-student-attendance-bulk",
        {
          students: students.map((s) => ({
            studentId: s.studentId,
            name: s.name,
            status: s.status,
          })),
          school: teacher.school,
          className: teacher.class,
        },
      );

      alert("Attendance submitted successfully");
      setLocked(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting attendance");
    }
  };

  if (loading) return <h2>Loading students...</h2>;

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Student Attendance - Class {teacher.class}</h2>

      <table
        border="1"
        style={{ margin: "auto", width: "80%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, index) => (
            <tr key={s.studentId}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.status}</td>
              <td>
                <button
                  disabled={locked}
                  onClick={() => changeStatus(index, "Present")}
                >
                  Present
                </button>

                <button
                  disabled={locked}
                  style={{ marginLeft: "10px" }}
                  onClick={() => changeStatus(index, "Absent")}
                >
                  Absent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button disabled={locked} onClick={finalSubmit}>
        Final Submit Attendance
      </button>

      {locked && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Attendance Locked for Today
        </p>
      )}
    </div>
  );
}

export default StudentAttendance;
