// src/pages/PatientDashboard.jsx
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function PatientDashboard() {
  const {
    currentUser,
    bookAppointment,
    appointments,
    cancelAppointment,
    doctors,
  } = useContext(AuthContext);

  const [doctorName, setDoctorName] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [onlyToday, setOnlyToday] = useState(false);

  const myAppointments = useMemo(() => {
    const mine = appointments.filter(
      (a) => a.patientName === currentUser.username
    );

    let filtered = mine;
    if (statusFilter !== "All") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    if (onlyToday) {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((a) => a.date === today);
    }

    return filtered;
  }, [appointments, currentUser.username, statusFilter, onlyToday]);

  const upcomingCount = myAppointments.filter(
    (a) => a.status === "Pending" || a.status === "Approved"
  ).length;

  const completedCount = myAppointments.filter(
    (a) => a.status === "Completed"
  ).length;

  const cancelledCount = myAppointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  const nextAppointment = useMemo(() => {
    const upcoming = appointments
      .filter(
        (a) =>
          a.patientName === currentUser.username &&
          (a.status === "Pending" || a.status === "Approved")
      )
      .sort(
        (a, b) =>
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
    return upcoming[0] || null;
  }, [appointments, currentUser.username]);

  const validateDate = (selectedDate) => {
    if (!selectedDate) return "Invalid date";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chosenDate = new Date(selectedDate);
    if (chosenDate < today) return "Invalid date";
    return "";
  };

  const validateTime = (selectedTime) => {
    if (!selectedTime) return "Invalid time";

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    const minMinutes = 9 * 60; // 9:00
    const maxMinutes = 18 * 60; // 18:00

    if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
      return "Invalid time";
    }

    return "";
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDate(value);
    setDateError(validateDate(value));
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);
    setTimeError(validateTime(value));
  };

  const handleBook = (e) => {
    e.preventDefault();

    const dError = validateDate(date);
    const tError = validateTime(time);

    setDateError(dError);
    setTimeError(tError);

    if (!doctorName || !consultationType || !date || !time || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (dError || tError) {
      toast.error("Invalid date or time");
      return;
    }

    const selectedDoctor = doctors.find(
      (d) => (d.name || d.username) === doctorName
    );

    bookAppointment({
      patientName: currentUser.username,
      doctorName,
      doctorUsername: selectedDoctor?.username,
      consultationType,
      date,
      time,
      reason,
    });

    toast.success("Appointment booked ✅");
    setDoctorName("");
    setConsultationType("");
    setDate("");
    setTime("");
    setReason("");
    setDateError("");
    setTimeError("");
  };

  const handleCancel = (id) => {
    cancelAppointment(id, currentUser.username);
    toast.info("Appointment cancelled");
  };

  return (
    <div className="page-shell">
      <div className="dashboard-grid">
        {/* HERO */}
        <section className="panel hero-panel">
          <span className="badge">Patient</span>
          <h2>Welcome, {currentUser.username}</h2>
          <p>
            Book new appointments and keep track of your upcoming visits with
            your doctors.
          </p>
          {nextAppointment && (
            <div className="appointment-card next-appt" style={{ marginTop: 16 }}>
              <div>
                <p className="mini-label">Next appointment</p>
                <h3>
                  {nextAppointment.date} at {nextAppointment.time}
                </h3>
                <p>
                  with <strong>{nextAppointment.doctorName}</strong>
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

        {/* DOCTORS */}
        <section className="panel full-panel">
          <div className="section-head">
            <h3>Available Doctors</h3>
            <span>{doctors.length} doctors</span>
          </div>
          <div className="grid-2 doctor-list">
            {doctors.map((doc) => (
              <div key={doc.username} className="appointment-card doctor-card">
                <div className="doctor-info-row">
                  <div className="doctor-avatar">
                    {doc.name?.charAt(0) || doc.username.charAt(0)}
                  </div>
                  <div>
                    <div className="doctor-name">{doc.name || doc.username}</div>
                    <div className="doctor-sub">@{doc.username}</div>
                  </div>
                </div>
                <p className="doctor-sub">
                  Specialty: General Physician • Timings: 9:00–18:00
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING FORM */}
        <section className="panel full-panel">
          <div className="section-head">
            <h3>Book Appointment</h3>
            <span>Fill details to request a slot</span>
          </div>
          <form onSubmit={handleBook} className="auth-form">
            <div className="grid-2">
              <div className="input-group">
                <label>Doctor</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.username} value={doc.name || doc.username}>
                      {doc.name || doc.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Consultation Type</label>
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="General Checkup">General Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Online Consultation">Online Consultation</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                />
                {dateError && <p className="error">{dateError}</p>}
              </div>

              <div className="input-group">
                <label>Time (9:00 - 18:00)</label>
                <input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                />
                {timeError && <p className="error">{timeError}</p>}
              </div>
            </div>

            <div className="input-group">
              <label>Reason / Notes</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your issue briefly"
              />
            </div>

            <button className="btn btn-primary full-width">
              Book Appointment
            </button>
          </form>
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
            <p className="empty">No appointments yet.</p>
          ) : (
            <div className="card-list">
              {myAppointments.map((a) => (
                <div key={a.id} className="appointment-card">
                  <div className="action-row">
                    <h4>{a.doctorName}</h4>
                    <span
                      className={`status status-${a.status.toLowerCase()}`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p>
                    {a.date} at {a.time} • {a.consultationType}
                  </p>
                  <p className="doctor-sub">Reason: {a.reason}</p>
                  {a.status !== "Cancelled" && a.status !== "Completed" && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleCancel(a.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}