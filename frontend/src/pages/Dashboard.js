import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const teacher = JSON.parse(localStorage.getItem("teacher"));

  const markMyAttendance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/mark-teacher-attendance",
        {
          teacherId: teacher.teacherId,
          name: teacher.name,
          school: teacher.school,
          class: teacher.class,
        },
      );

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error marking attendance");
    }
  };

  if (!teacher) {
    return <h2>Please login first</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Teacher Dashboard</h2>

      <p>
        <strong>Name:</strong> {teacher.name}
      </p>
      <p>
        <strong>Teacher ID:</strong> {teacher.teacherId}
      </p>
      <p>
        <strong>School:</strong> {teacher.school}
      </p>
      <p>
        <strong>Class Teacher Of:</strong> {teacher.class}
      </p>

      <br />

      <button onClick={markMyAttendance}>Mark My Attendance</button>

      <br />
      <br />

      <button onClick={() => navigate("/mark-student-attendance")}>
        Mark Student Attendance
      </button>
    </div>
  );
}

export default Dashboard;
