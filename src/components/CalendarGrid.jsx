import { useState } from "react";

export default function CalendarGrid({ appointments = [], onSave, isDarkMode, onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions to replace date-fns
  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const getDay = (date) => date.getDay();
  const format = (date, formatStr) => {
    if (formatStr === "d") return date.getDate().toString();
    if (formatStr === "yyyy-MM-dd") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (formatStr === "yyyy-MM") {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    }
    if (formatStr === "MMMM yyyy") {
      const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toString();
  };
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startWeekday = getDay(monthStart);
  const totalDays = monthEnd.getDate();

  const rows = [];
  let dayCounter = 1;
  let nextMonthDay = 1;
  const totalCells = startWeekday + totalDays;
  const totalWeeks = Math.ceil(totalCells / 7);

  const themeStyles = {
    prevNextMonth: isDarkMode
      ? "bg-slate-800/20 text-slate-500 border border-slate-700/20"
      : "bg-slate-50/80 text-slate-400 border border-slate-200/40",
    currentDayCell: isDarkMode
      ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/60 text-slate-100 shadow-sm"
      : "bg-white/95 border-slate-200/60 hover:bg-blue-50/50 text-slate-900 shadow-sm",
    todayBorder: isDarkMode
      ? "ring-2 ring-blue-400/60 border-blue-400/40"
      : "ring-2 ring-blue-500/60 border-blue-500/40",
    appointmentCard: isDarkMode
      ? "bg-slate-700/80 text-slate-200 border border-slate-600/40"
      : "bg-blue-50/90 text-slate-700 border border-blue-100/60",
    appointmentName: isDarkMode ? "text-slate-200" : "text-slate-800",
    appointmentTime: isDarkMode ? "text-blue-300" : "text-blue-700",
    appointmentDoctor: isDarkMode ? "text-slate-400" : "text-slate-600",
    moreIndicator: isDarkMode
      ? "text-blue-400 bg-slate-700/60 border border-blue-600/30"
      : "text-blue-600 bg-blue-100/80 border border-blue-200/50",
    navButtons: isDarkMode
      ? "bg-slate-700/60 hover:bg-slate-600/70 text-slate-200 border border-slate-600/40"
      : "bg-white/90 hover:bg-slate-50/90 text-slate-700 border border-slate-300/50",
    monthTitle: isDarkMode ? "text-slate-200" : "text-slate-800",
    weekdayHeaders: isDarkMode ? "text-slate-300" : "text-slate-700",
    appointmentIndicator: isDarkMode ? "bg-blue-400" : "bg-blue-600",
  };

  for (let week = 0; week < totalWeeks; week++) {
    const days = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const cellIndex = week * 7 + weekday;

      if (cellIndex < startWeekday) {
        const prevDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          -(startWeekday - weekday - 1)
        );
        days.push(
          <div
            key={`prev-${week}-${weekday}`}
            className={`p-2 h-32 ${themeStyles.prevNextMonth} text-sm text-center rounded-lg select-none transition-colors duration-200`}
          >
            <div className="font-medium opacity-50">{format(prevDate, "d")}</div>
          </div>
        );
      } else if (dayCounter > totalDays) {
        const nextDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          nextMonthDay++
        );
        days.push(
          <div
            key={`next-${week}-${weekday}`}
            className={`p-2 h-32 ${themeStyles.prevNextMonth} text-sm text-center rounded-lg select-none transition-colors duration-200`}
          >
            <div className="font-medium opacity-50">{format(nextDate, "d")}</div>
          </div>
        );
      } else {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          dayCounter
        );
        const dateStr = format(date, "yyyy-MM-dd");
        const dailyAppointments = appointments.filter((appt) => appt.date === dateStr);
        const isToday = isSameDay(date, new Date());

        days.push(
          <div
            key={dateStr}
            className={`border p-2 h-32 overflow-hidden rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${themeStyles.currentDayCell} ${isToday ? themeStyles.todayBorder : ""
              }`}
            onClick={() => onDateClick?.(dateStr)}
          >
            {/* Date Header */}
            <div className="flex justify-between items-start mb-2">
              <div className={`text-sm font-semibold ${isToday ? (isDarkMode ? "text-blue-400" : "text-blue-600") : ""}`}>
                {dayCounter}
              </div>
              {dailyAppointments.length > 0 && (
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${themeStyles.appointmentIndicator}`} />
                  <span className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {dailyAppointments.length}
                  </span>
                </div>
              )}
            </div>

            {/* Appointments List - Improved visibility */}
            <div className="space-y-1">
              {dailyAppointments.slice(0, 3).map((appt, idx) => (
                <div
                  key={idx}
                  className={`text-xs ${themeStyles.appointmentCard} px-2 py-1 rounded transition-colors duration-200`}
                >
                  <div className={`font-medium truncate ${themeStyles.appointmentName}`}>
                    {appt.name}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs ${themeStyles.appointmentTime}`}>
                      {appt.time}
                    </span>
                    {appt.doctor && (
                      <span className={`text-xs ${themeStyles.appointmentDoctor}`}>
                        {appt.doctor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Show remaining appointments count if there are more than 3 */}
              {dailyAppointments.length > 3 && (
                <div className={`text-xs px-2 py-1 rounded text-center font-medium ${themeStyles.moreIndicator}`}>
                  +{dailyAppointments.length - 3} more appointments
                </div>
              )}
            </div>
          </div>
        );

        dayCounter++;
      }
    }

    rows.push(
      <div className="grid grid-cols-7 gap-2" key={week}>
        {days}
      </div>
    );
  }

  const totalMonthlyAppointments = appointments.filter((appt) =>
    appt.date.startsWith(format(currentMonth, "yyyy-MM"))
  ).length;

  return (
    <div className="space-y-4 p-4">
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm ${themeStyles.navButtons}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="font-medium text-sm">Previous</span>
        </button>

        <div className="text-center">
          <h1 className={`text-2xl font-bold tracking-tight ${themeStyles.monthTitle}`}>
            {format(currentMonth, "MMMM yyyy")}
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Medical Appointment Schedule
          </p>
        </div>

        <button
          onClick={() =>
            setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm ${themeStyles.navButtons}`}
        >
          <span className="font-medium text-sm">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div
        className={`grid grid-cols-7 text-center font-semibold ${themeStyles.weekdayHeaders} text-sm py-3 rounded-lg ${isDarkMode ? "bg-slate-800/30" : "bg-slate-50/80"
          } border ${isDarkMode ? "border-slate-700/30" : "border-slate-200/40"}`}
      >
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
          (day) => (
            <div className="py-1" key={day}>
              {day}
            </div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">{rows}</div>

      {/* Professional Stats Footer */}
      <div
        className={`mt-6 p-4 rounded-lg ${isDarkMode ? "bg-slate-800/40" : "bg-slate-50/80"
          } border ${isDarkMode ? "border-slate-700/40" : "border-slate-200/50"}`}
      >
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${themeStyles.appointmentIndicator}`} />
              <span className={`font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                Total Appointments: {totalMonthlyAppointments}
              </span>
            </div>
            <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
              {format(currentMonth, "MMMM yyyy")}
            </div>
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Click any date to view or manage appointments
          </div>
        </div>
      </div>
    </div>
  );
}