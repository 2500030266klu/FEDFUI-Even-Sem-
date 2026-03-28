import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PatientHome() {
  const { currentUser, appointments } = useContext(AuthContext);

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.patientName === currentUser.username),
    [appointments, currentUser.username]
  );

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        <section className="panel hero-panel">
          <span className="badge">Patient</span>
          <h2>Welcome, {currentUser.username}</h2>
          <p>Overview of your upcoming and past appointments.</p>
        </section>

        <section className="panel full-panel">
          <div className="section-head">
            <h3>My Appointments</h3>
            <span>{myAppointments.length} bookings</span>
          </div>

          <div className="card-list">
            {myAppointments.length === 0 ? (
              <p className="empty">No appointments booked yet.</p>
            ) : (
              myAppointments.map((item) => (
                <div key={item.id} className="appointment-card">
                  <div>
                    <strong>Doctor:</strong> {item.doctorName}
                  </div>
                  <div>
                    <strong>Consultation:</strong> {item.consultationType}
                  </div>
                  <div>
                    <strong>Date:</strong> {item.date}
                  </div>
                  <div>
                    <strong>Time:</strong> {item.time}
                  </div>
                  <div>
                    <strong>Reason:</strong> {item.reason}
                  </div>
                  <span className="status">{item.status}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}