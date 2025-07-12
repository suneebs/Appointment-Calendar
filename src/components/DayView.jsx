import { useState } from "react";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import AppointmentModal from "./AppointmentModal";

export default function DayView({ appointments, onSave, isDarkMode }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showModal, setShowModal] = useState(false);

  const today = startOfDay(new Date());
  const isPastDate = isBefore(parseISO(selectedDate), today);

  // Filter appointments for selected date
  const dailyAppointments = appointments
    .filter((appt) => appt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Professional theme styling system
  const themeStyles = {
    container: {
      background: isDarkMode ? "bg-gray-800" : "bg-white",
      text: isDarkMode ? "text-gray-100" : "text-gray-900",
      border: isDarkMode ? "border border-gray-700" : "shadow"
    },
    dateInput: {
      background: isDarkMode ? "bg-gray-700" : "bg-white",
      border: isDarkMode ? "border-gray-600" : "border-gray-300",
      text: isDarkMode ? "text-gray-100" : "text-gray-900",
      focus: isDarkMode 
        ? "focus:border-blue-400 focus:ring-blue-400" 
        : "focus:border-blue-500 focus:ring-blue-500"
    },
    label: {
      text: isDarkMode ? "text-gray-200" : "text-gray-700"
    },
    appointments: {
      card: {
        background: isDarkMode ? "bg-gray-700" : "bg-blue-50",
        border: isDarkMode ? "border-l-4 border-blue-400" : "border-l-4 border-blue-500",
        shadow: isDarkMode ? "shadow-md" : "shadow-sm"
      },
      name: isDarkMode ? "text-gray-100" : "text-gray-800",
      details: isDarkMode ? "text-gray-300" : "text-gray-600"
    },
    emptyState: {
      text: isDarkMode ? "text-gray-400" : "text-gray-500"
    },
    alerts: {
      warning: {
        text: isDarkMode ? "text-red-400" : "text-red-600",
        background: isDarkMode ? "bg-red-900/20" : "bg-red-50",
        border: isDarkMode ? "border border-red-800" : "border border-red-200"
      }
    },
    buttons: {
      primary: {
        enabled: isDarkMode 
          ? "bg-blue-600 hover:bg-blue-700 text-white" 
          : "bg-blue-600 hover:bg-blue-700 text-white",
        disabled: isDarkMode 
          ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
          : "bg-gray-400 text-gray-600 cursor-not-allowed"
      }
    }
  };

  const handleSave = (updatedAppointments) => {
    onSave(updatedAppointments); // Accepts full updated list
    setShowModal(false);
  };

  return (
    <div className={`${themeStyles.container.background} ${themeStyles.container.text} ${themeStyles.container.border} p-4 rounded max-h-[90vh] overflow-y-auto transition-all duration-200`}>
      {/* Date Picker */}
      <div className="mb-4">
        <label className={`block text-sm font-semibold mb-1 ${themeStyles.label.text} transition-colors duration-200`}>
          Select Date
        </label>
        <input
          type="date"
          className={`w-full ${themeStyles.dateInput.background} ${themeStyles.dateInput.border} ${themeStyles.dateInput.text} ${themeStyles.dateInput.focus} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Appointments List */}
      <div className="flex flex-col gap-3">
        {dailyAppointments.length > 0 ? (
          dailyAppointments.map((appt, idx) => (
            <div
              key={idx}
              className={`${themeStyles.appointments.card.border} ${themeStyles.appointments.card.background} px-3 py-2 rounded ${themeStyles.appointments.card.shadow} transition-all duration-200 hover:shadow-md`}
            >
              <div className={`text-sm font-semibold ${themeStyles.appointments.name}`}>
                {appt.name}
              </div>
              <div className={`text-xs ${themeStyles.appointments.details}`}>
                {appt.time} — <span className="italic">{appt.doctor}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={`${themeStyles.emptyState.text} text-sm italic text-center py-8 transition-colors duration-200`}>
            No appointments for this day
          </div>
        )}
      </div>

      {/* Past Date Warning */}
      {isPastDate && (
        <div className={`text-sm ${themeStyles.alerts.warning.text} ${themeStyles.alerts.warning.background} ${themeStyles.alerts.warning.border} mt-4 p-3 rounded text-center transition-colors duration-200`}>
          <span className="font-medium">Past Date Notice:</span> Appointments cannot be added or edited for previous dates.
        </div>
      )}

      {/* Add Appointment Button */}
      <div className="mt-6">
        <button
          className={`w-full py-3 rounded text-white font-medium transition-all duration-200 ${
            isPastDate
              ? themeStyles.buttons.primary.disabled
              : themeStyles.buttons.primary.enabled
          } ${!isPastDate ? 'transform hover:scale-[1.02] active:scale-[0.98]' : ''}`}
          onClick={() => {
            if (!isPastDate) setShowModal(true);
          }}
          disabled={isPastDate}
        >
          {isPastDate ? "Cannot Edit Past Appointments" : "Add / Edit Appointments"}
        </button>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          appointments={appointments}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}