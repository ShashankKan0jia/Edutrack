import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StudentAttendance from "./pages/StudentAttendance";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/mark-student-attendance"
          element={<StudentAttendance />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
