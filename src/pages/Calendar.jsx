import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CalendarGrid from "../components/CalendarGrid";
import DayView from "../components/DayView";
import { loadAppointments, saveAppointments } from "../utils/storage";

export default function Calendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = loadAppointments();
    setAppointments(stored);
  }, []);

  const handleSaveAppointment = (newAppointment) => {
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-700">Appointment Calendar</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <DayView 
        appointments={appointments}
        onSave={(updated) => {
      setAppointments(updated);
      saveAppointments(updated);  
  }} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <CalendarGrid
  appointments={appointments}
  onSave={(updated) => {
    setAppointments(updated);
    saveAppointments(updated);
  }}
/>
      </div>
    </div>
  );
}
