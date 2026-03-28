// src/pages/DoctorDashboard.jsx
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { currentUser, appointments, updateAppointmentStatus } =
    useContext(AuthContext);

  const [statusFilter, setStatusFilter] = useState("All");
  const [onlyToday, setOnlyToday] = useState(false);

  // All appointments belonging to this doctor
  const myAppointments = useMemo(() => {
    const mine = appointments.filter(
      (a) =>
        // New appointments: match doctorUsername
        a.doctorUsername === currentUser.username ||
        // Fallbacks for old data
        a.doctorName === currentUser.name ||
        a.doctorName === currentUser.username
    );

    let filtered = mine;
    if (statusFilter !== "All") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (onlyToday) {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((a) => a.date === today);
    }

    // Sort by date+time ascending
    return [...filtered].sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );
  }, [appointments, currentUser, statusFilter, onlyToday]);

  const upcomingCount = myAppointments.filter(
    (a) => a.status === "Pending" || a.status === "Approved"
  ).length;

  const completedCount = myAppointments.filter(
    (a) => a.status === "Completed"
  ).length;

  const cancelledCount = myAppointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  const nextAppointment = myAppointments.find(
    (a) => a.status === "Pending" || a.status === "Approved"
  );

  const handleStatusChange = (id, status) => {
    updateAppointmentStatus(id, status);
    toast.success(`Status updated to ${status}`);
  };

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        {/* HERO */}
        <section className="panel hero-panel">
          <span className="badge">Doctor</span>
          <h2>Welcome, {currentUser.name || currentUser.username}</h2>
          <p>
            Review and manage your patient appointments, update their status, and
            track today&apos;s schedule.
          </p>
          {nextAppointment && (
            <div className="appointment-card next-appt" style={{ marginTop: 16 }}>
              <div>
                <p className="mini-label">Next appointment</p>
                <h3>
                  {nextAppointment.date} at {nextAppointment.time}
                </h3>
                <p>
                  Patient: <strong>{nextAppointment.patientName}</strong>
                </p>
              </div>
              <span
                className={`status status-${nextAppointment.status.toLowerCase()}`}
              >
                {nextAppointment.status}
              </span>
            </div>
          )}
        </section>

        {/* STATS */}
        <section className="panel full-panel">
          <div className="grid-3">
            <div className="mini-card">
              <p className="mini-label">Upcoming</p>
              <h3>{upcomingCount}</h3>
            </div>
            <div className="mini-card">
              <p className="mini-label">Completed</p>
              <h3>{completedCount}</h3>
            </div>
            <div className="mini-card">
              <p className="mini-label">Cancelled</p>
              <h3>{cancelledCount}</h3>
            </div>
          </div>
        </section>

        {/* APPOINTMENT LIST */}
        <section className="panel full-panel">
          <div className="section-head">
            <h3>Your Appointments</h3>
            <div className="action-row">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                className={`btn btn-secondary today-btn ${
                  onlyToday ? "today-active" : ""
                }`}
                onClick={() => setOnlyToday((p) => !p)}
              >
                Today
              </button>
            </div>
          </div>

          {myAppointments.length === 0 ? (
            <p className="empty">No appointments assigned to you yet.</p>
          ) : (
            <div className="card-list">
              {myAppointments.map((a) => (
                <div key={a.id} className="appointment-card">
                  <div className="action-row">
                    <div>
                      <h4>{a.patientName}</h4>
                      <p className="doctor-sub">
                        {a.date} at {a.time} • {a.consultationType}
                      </p>
                    </div>
                    <span
                      className={`status status-${a.status.toLowerCase()}`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="doctor-sub">Reason: {a.reason}</p>
                  <div className="action-row" style={{ marginTop: 8 }}>
                    <span className="mini-label">
                      For Dr.{" "}
                      {currentUser.name || currentUser.username}
                    </span>
                    <div className="status-buttons">
                      {a.status !== "Cancelled" && (
                        <>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                              handleStatusChange(a.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() =>
                              handleStatusChange(a.id, "Completed")
                            }
                          >
                            Complete
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() =>
                              handleStatusChange(a.id, "Cancelled")
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}