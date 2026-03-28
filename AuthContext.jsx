import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

const seedDoctors = [
  { username: "drsmith", password: "1234", role: "doctor", name: "Dr. Smith" },
  { username: "drjain", password: "1234", role: "doctor", name: "Dr. Jain" },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const savedUser = JSON.parse(localStorage.getItem("currentUser")) || null;
    const savedAppointments =
      JSON.parse(localStorage.getItem("appointments")) || [];

    setUsers([
      ...seedDoctors,
      ...savedUsers.filter((u) => u.role !== "doctor"),
    ]);
    setCurrentUser(savedUser);
    setAppointments(savedAppointments);
  }, []);

  useEffect(() => {
    const customUsers = users.filter(
      (u) => !seedDoctors.some((d) => d.username === u.username)
    );

    localStorage.setItem("users", JSON.stringify(customUsers));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [users, currentUser, appointments]);

  const register = (newUser) => {
    const exists = users.find(
      (u) => u.username === newUser.username && u.role === newUser.role
    );
    if (exists) return { success: false, message: "Username already exists" };

    setUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  const login = (username, password, role) => {
    const allUsers = [...seedDoctors, ...users];

    const user = allUsers.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      const exists = allUsers.some(
        (u) => u.username === username && u.role === role
      );
      return {
        success: false,
        message: exists ? "Invalid password" : "Username not found",
      };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  const logout = () => setCurrentUser(null);

  const bookAppointment = (appointment) => {
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      status: "Pending",
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    return newAppointment;
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const cancelAppointment = (id, username) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id && a.patientName === username
          ? { ...a, status: "Cancelled" }
          : a
      )
    );
  };

  const doctors = useMemo(
    () => users.filter((u) => u.role === "doctor"),
    [users]
  );

  const value = useMemo(
    () => ({
      users,
      currentUser,
      appointments,
      doctors,
      register,
      login,
      logout,
      bookAppointment,
      updateAppointmentStatus,
      cancelAppointment,
    }),
    [users, currentUser, appointments, doctors]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}