import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CalendarGrid from "../components/CalendarGrid";
import DayView from "../components/DayView";
import { loadAppointments, saveAppointments } from "../utils/storage";
import AppointmentModal from "../components/AppointmentModal";

export default function Calendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const handleOpenModal = (dateStr) => {
  setSelectedDate(dateStr);
  setShowModal(true);
};

  useEffect(() => {
    // Load stored appointments
    const stored = loadAppointments();
    setAppointments(stored);

    // Load theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    // Apply dark or light theme to document
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleAppointmentSave = (updated) => {
    setAppointments(updated);
    saveAppointments(updated);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
    }`}>
      {/* Header */}
      <header
  className={`border-b backdrop-blur-sm transition-all duration-300 ${
    isDarkMode ? "bg-slate-900/95 border-slate-700/60" : "bg-white/95 border-slate-200/60"
  }`}
>
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-3">
    <div className="flex justify-between items-center">
      {/* Branding */}
      <div className="flex items-center space-x-3">
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-500 to-indigo-600"
              : "bg-gradient-to-br from-blue-600 to-indigo-700"
          }`}
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h1
            className={`text-xl md:text-2xl font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Calendar
          </h1>
          <p
            className={`text-xs md:text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            For Clinic Staff
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isDarkMode
              ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }`}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-rotate-12"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm md:text-base font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md md:shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</header>


      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-3 md:px-6 py-4 md:py-8">
        {/* Mobile DayView */}
        <div className="block md:hidden">
          <div className={`rounded-xl shadow-lg overflow-hidden ${
            isDarkMode ? "bg-slate-800/60 border border-slate-700/60" : "bg-white/90 border border-slate-200/60"
          } backdrop-blur-sm`}>
            <DayView
              appointments={appointments}
              onSave={handleAppointmentSave}
              isDarkMode={isDarkMode}
              onDateClick={handleOpenModal}
            />
          </div>
        </div>

        {/* Desktop CalendarGrid */}
        <div className="hidden md:block">
          <div className={`rounded-2xl shadow-xl overflow-hidden ${
            isDarkMode ? "bg-slate-800/60 border border-slate-700/60" : "bg-white/90 border border-slate-200/60"
          } backdrop-blur-sm`}>
            <CalendarGrid
              appointments={appointments}
              onSave={handleAppointmentSave}
              onDateClick={(dateStr) => {
    setSelectedDate(dateStr);
    setShowModal(true);
  }}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
        {showModal && selectedDate && (
  <AppointmentModal
    selectedDate={selectedDate}
    onClose={() => setShowModal(false)}
    onSave={handleAppointmentSave}
    appointments={appointments}
    isDarkMode={isDarkMode}
  />
)}


      </main>
    </div>
  );
}
