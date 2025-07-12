import { useState } from "react";
import { format, parseISO, isBefore, startOfDay } from "date-fns";

export default function DayView({ appointments, onSave, isDarkMode, onDateClick }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const today = startOfDay(new Date());
  const isPastDate = isBefore(parseISO(selectedDate), today);

  // Filter appointments for selected date
  const dailyAppointments = appointments
    .filter((appt) => appt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Professional enterprise-grade styling system
  const themeStyles = {
    container: {
      background: isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-white to-slate-50",
      text: isDarkMode ? "text-slate-100" : "text-slate-900",
      border: isDarkMode 
        ? "border border-slate-700/50 backdrop-blur-sm" 
        : "border border-slate-200/60 backdrop-blur-sm shadow-xl shadow-slate-200/20"
    },
    dateSection: {
      background: isDarkMode 
        ? "bg-slate-800/60 backdrop-blur-sm" 
        : "bg-white/80 backdrop-blur-sm",
      border: isDarkMode 
        ? "border border-slate-700/40" 
        : "border border-slate-200/50 shadow-sm"
    },
    dateInput: {
      background: isDarkMode ? "bg-slate-700/50" : "bg-white",
      border: isDarkMode 
        ? "border-slate-600/60 shadow-inner" 
        : "border-slate-300/70 shadow-sm",
      text: isDarkMode ? "text-slate-100" : "text-slate-900",
      focus: isDarkMode 
        ? "focus:border-blue-400/80 focus:ring-blue-400/30 focus:shadow-lg focus:shadow-blue-500/20" 
        : "focus:border-blue-500/80 focus:ring-blue-500/30 focus:shadow-lg focus:shadow-blue-500/10"
    },
    label: {
      text: isDarkMode ? "text-slate-200" : "text-slate-700"
    },
    appointmentsList: {
      background: isDarkMode 
        ? "bg-slate-800/40 backdrop-blur-sm" 
        : "bg-white/60 backdrop-blur-sm",
      border: isDarkMode 
        ? "border border-slate-700/40" 
        : "border border-slate-200/50"
    },
    appointments: {
      card: {
        background: isDarkMode 
          ? "bg-gradient-to-r from-slate-700/70 to-slate-700/50 backdrop-blur-sm" 
          : "bg-gradient-to-r from-blue-50/80 to-white/90 backdrop-blur-sm",
        border: isDarkMode 
          ? "border-l-4 border-blue-400/90 border-r border-r-slate-600/30 border-t border-t-slate-600/30 border-b border-b-slate-600/30" 
          : "border-l-4 border-blue-500/90 border-r border-r-slate-200/40 border-t border-t-slate-200/40 border-b border-b-slate-200/40",
        shadow: isDarkMode 
          ? "shadow-lg shadow-slate-900/40" 
          : "shadow-md shadow-slate-200/60",
        hover: isDarkMode 
          ? "hover:shadow-xl hover:shadow-slate-900/60 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-700/60" 
          : "hover:shadow-lg hover:shadow-slate-200/80 hover:bg-gradient-to-r hover:from-blue-50/90 hover:to-white/95"
      },
      name: isDarkMode ? "text-slate-100" : "text-slate-800",
      details: isDarkMode ? "text-slate-300" : "text-slate-600",
      time: isDarkMode ? "text-blue-300" : "text-blue-700",
      doctor: isDarkMode ? "text-slate-400" : "text-slate-500"
    },
    emptyState: {
      background: isDarkMode 
        ? "bg-slate-800/30 backdrop-blur-sm" 
        : "bg-slate-50/50 backdrop-blur-sm",
      border: isDarkMode 
        ? "border border-dashed border-slate-600/50" 
        : "border border-dashed border-slate-300/60",
      text: isDarkMode ? "text-slate-400" : "text-slate-500"
    },
    alerts: {
      warning: {
        text: isDarkMode ? "text-amber-300" : "text-amber-700",
        background: isDarkMode 
          ? "bg-gradient-to-r from-amber-900/30 to-orange-900/20 backdrop-blur-sm" 
          : "bg-gradient-to-r from-amber-50/80 to-orange-50/60 backdrop-blur-sm",
        border: isDarkMode 
          ? "border border-amber-800/50 shadow-lg shadow-amber-900/30" 
          : "border border-amber-200/70 shadow-sm shadow-amber-200/40",
        icon: isDarkMode ? "text-amber-400" : "text-amber-600"
      }
    },
    buttons: {
      primary: {
        enabled: isDarkMode 
          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-900/40 hover:shadow-xl hover:shadow-blue-900/60" 
          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
        disabled: isDarkMode 
          ? "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-500 cursor-not-allowed shadow-inner" 
          : "bg-gradient-to-r from-slate-400 to-slate-500 text-slate-600 cursor-not-allowed shadow-inner"
      }
    }
  };

  const handleSave = (updatedAppointments) => {
    onSave(updatedAppointments);
    setShowModal(false);
  };

  return (
    <div className={`${themeStyles.container.background} ${themeStyles.container.text} ${themeStyles.container.border} rounded-2xl max-h-[90vh] overflow-hidden transition-all duration-300 ease-in-out`}>
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-slate-200/20">
        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          Daily Schedule
        </h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage your appointments and schedule
        </p>
      </div>

      {/* Content Area */}
      <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        {/* Date Picker Section */}
        <div className={`${themeStyles.dateSection.background} ${themeStyles.dateSection.border} p-6 rounded-xl mb-6 transition-all duration-200`}>
          <label className={`block text-sm font-semibold mb-3 ${themeStyles.label.text} tracking-wide uppercase`}>
            Select Date
          </label>
          <input
            type="date"
            className={`w-full ${themeStyles.dateInput.background} border ${themeStyles.dateInput.border} ${themeStyles.dateInput.text} ${themeStyles.dateInput.focus} rounded-lg px-4 py-3 text-base font-medium focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200`}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Appointments Section */}
        <div className={`${themeStyles.appointmentsList.background} ${themeStyles.appointmentsList.border} rounded-xl p-6 mb-6 transition-all duration-200`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} tracking-tight`}>
              Appointments
            </h2>
            <span className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'} font-medium`}>
              {dailyAppointments.length} {dailyAppointments.length === 1 ? 'appointment' : 'appointments'}
            </span>
          </div>

          <div className="space-y-3">
            {dailyAppointments.length > 0 ? (
              dailyAppointments.map((appt, idx) => (
                <div
                  key={idx}
                  className={`${themeStyles.appointments.card.border} ${themeStyles.appointments.card.background} px-5 py-4 rounded-xl ${themeStyles.appointments.card.shadow} ${themeStyles.appointments.card.hover} transition-all duration-200 transform hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`text-base font-semibold ${themeStyles.appointments.name} mb-1`}>
                        {appt.name}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`font-medium ${themeStyles.appointments.time}`}>
                          {appt.time}
                        </span>
                        <span className={`${themeStyles.appointments.doctor}`}>
                          Dr. {appt.doctor}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} opacity-80`}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`${themeStyles.emptyState.background} ${themeStyles.emptyState.border} ${themeStyles.emptyState.text} text-center py-12 rounded-xl transition-all duration-200`}>
                <div className="text-4xl mb-4 opacity-40">📅</div>
                <div className="text-base font-medium mb-2">No appointments scheduled</div>
                <div className="text-sm opacity-75">Your schedule is clear for this day</div>
              </div>
            )}
          </div>
        </div>

        {/* Past Date Warning */}
        {isPastDate && (
          <div className={`${themeStyles.alerts.warning.background} ${themeStyles.alerts.warning.border} p-4 rounded-xl mb-6 transition-all duration-200`}>
            <div className="flex items-center gap-3">
              <div className={`text-lg ${themeStyles.alerts.warning.icon}`}>⚠️</div>
              <div>
                <div className={`text-sm font-semibold ${themeStyles.alerts.warning.text}`}>
                  Past Date Notice
                </div>
                <div className={`text-xs mt-1 ${themeStyles.alerts.warning.text} opacity-90`}>
                  Appointments cannot be added or edited for previous dates
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          <button
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
              isPastDate
                ? themeStyles.buttons.primary.disabled
                : themeStyles.buttons.primary.enabled
            } ${!isPastDate ? 'transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-0.5' : ''}`}
            onClick={() => {
              if (!isPastDate) onDateClick(selectedDate);
            }}
            disabled={isPastDate}
          >
            {isPastDate ? "Cannot Edit Past Appointments" : "✨ Manage Appointments"}
          </button>
        </div>
      </div>

    </div>
  );
}