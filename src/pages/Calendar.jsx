import { useNavigate } from "react-router-dom";
import CalendarGrid from "../components/CalendarGrid";
import DayView from "../components/DayView";

export default function Calendar() {
  const navigate = useNavigate();

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

      {/* Mobile: Show day view */}
      <div className="block md:hidden">
        <DayView />
      </div>

      {/* Desktop: Show month view */}
      <div className="hidden md:block">
        <CalendarGrid />
      </div>
    </div>
  );
}
