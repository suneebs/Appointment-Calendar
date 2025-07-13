import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CalendarGrid from "../components/CalendarGrid";
import DayView from "../components/DayView";
import { loadAppointments, saveAppointments } from "../utils/storage";
import AppointmentModal from "../components/AppointmentModal";

const PATIENTS = ["Peter Parker", "Clark Kent", "Bruce Wayne", "Diana Prince", "Tony Stark"];
const DOCTORS = ["Dr. Phoebe", "Dr. Ross", "Dr. Monica", "Dr. Chandler", "Dr. Joey"];

export default function Calendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenModal = (dateStr) => {
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const stored = loadAppointments();
        setAppointments(stored);

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          setIsDarkMode(true);
        } else if (savedTheme === "light") {
          setIsDarkMode(false);
        } else {
          setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleAppointmentSave = (updated) => {
    setAppointments(updated);
    saveAppointments(updated);
  };

  const clearFilters = () => {
    setSelectedDoctor("");
    setSelectedPatient("");
  };

  const filteredAppointments = appointments.filter((appt) => {
    const doctorMatch = selectedDoctor ? appt.doctor === selectedDoctor : true;
    const patientMatch = selectedPatient ? appt.name === selectedPatient : true;
    return doctorMatch && patientMatch;
  });

  const hasActiveFilters = selectedDoctor || selectedPatient;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b backdrop-blur-sm transition-all duration-300 sticky top-0 z-10 ${
          isDarkMode ? "bg-slate-900/95 border-slate-700/60" : "bg-white/95 border-slate-200/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Branding */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg ${
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
                  Medical Calendar
                </h1>
                <p
                  className={`text-xs md:text-sm font-medium ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Healthcare Management System
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 md:p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform"
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
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform"
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
                className="px-4 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm md:text-base font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md md:shadow-lg"
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
        {/* Filters Section */}
        <div className={`mb-6 p-4 md:p-6 rounded-xl shadow-lg ${
          isDarkMode
            ? "bg-slate-800/60 border border-slate-700/60"
            : "bg-white/90 border border-slate-200/60"
        } backdrop-blur-sm`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <svg
                className={`w-5 h-5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z"
                />
              </svg>
              <h2 className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}>
                Filter Appointments
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className={`px-4 py-2.5 border rounded-lg text-sm font-medium min-w-[160px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="">All Doctors</option>
                {DOCTORS.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>

              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className={`px-4 py-2.5 border rounded-lg text-sm font-medium min-w-[160px] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="">All Patients</option>
                {PATIENTS.map((pat) => (
                  <option key={pat} value={pat}>
                    {pat}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isDarkMode
                      ? "bg-slate-600 hover:bg-slate-500 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Summary */}
          {/* {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex flex-wrap gap-2">
                {selectedDoctor && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Doctor: {selectedDoctor}
                  </span>
                )}
                {selectedPatient && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Patient: {selectedPatient}
                  </span>
                )}
                <span className={`text-xs font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  Showing {filteredAppointments.length} of {appointments.length} appointments
                </span>
              </div>
            </div>
          )} */}
        </div>

        {/* Mobile DayView */}
        <div className="block md:hidden">
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode
                ? "bg-slate-800/60 border border-slate-700/60"
                : "bg-white/90 border border-slate-200/60"
            } backdrop-blur-sm`}
          >
            <DayView
              appointments={filteredAppointments}
              onSave={handleAppointmentSave}
              isDarkMode={isDarkMode}
              onDateClick={handleOpenModal}
            />
          </div>
        </div>

        {/* Desktop CalendarGrid */}
        <div className="hidden md:block">
          <div
            className={`rounded-2xl shadow-xl overflow-hidden ${
              isDarkMode
                ? "bg-slate-800/60 border border-slate-700/60"
                : "bg-white/90 border border-slate-200/60"
            } backdrop-blur-sm`}
          >
            <CalendarGrid
              appointments={filteredAppointments}
              onSave={handleAppointmentSave}
              onDateClick={handleOpenModal}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Modal */}
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