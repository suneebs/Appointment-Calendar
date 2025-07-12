import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CalendarGrid from "../components/CalendarGrid";
import DayView from "../components/DayView";
import { loadAppointments, saveAppointments } from "../utils/storage";

export default function Calendar() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = loadAppointments();
    setAppointments(stored);
    
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else {
      // Default to system preference
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-xl font-bold ${
          isDarkMode ? "text-blue-400" : "text-blue-700"
        }`}>
          Appointment Calendar
        </h1>
        
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                : "bg-white hover:bg-gray-50 text-gray-700"
            } border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              // Sun icon for light mode
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <DayView 
          appointments={appointments}
          onSave={(updated) => {
            setAppointments(updated);
            saveAppointments(updated);  
          }} 
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <CalendarGrid
          appointments={appointments}
          onSave={(updated) => {
            setAppointments(updated);
            saveAppointments(updated);
          }}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}