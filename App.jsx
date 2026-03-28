// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Feedback from "./pages/Feedback";

function ProtectedRoute({ children, role }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="app">
      <Header />
      <div className="app-layout">
        {currentUser && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                currentUser ? (
                  currentUser.role === "doctor" ? (
                    <Navigate to="/doctor-dashboard" replace />
                  ) : (
                    <Navigate to="/patient-dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}