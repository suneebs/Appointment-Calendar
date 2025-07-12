import {
  startOfMonth,
  endOfMonth,
  getDay,
  format,
  isSameDay,
} from "date-fns";
import { useState } from "react";
import AppointmentModal from "./AppointmentModal";

export default function CalendarGrid({ appointments, onSave, isDarkMode, onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const handleSave = (updatedAppointments) => {
    onSave(updatedAppointments);
    setShowModal(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startWeekday = getDay(monthStart);
  const totalDays = parseInt(format(monthEnd, "d"));

  const rows = [];
  let dayCounter = 1;
  let nextMonthDay = 1;
  const totalCells = startWeekday + totalDays;
  const totalWeeks = Math.ceil(totalCells / 7);

  const themeStyles = {
    prevNextMonth: isDarkMode
      ? "bg-slate-800/30 text-slate-600 border border-slate-700/30"
      : "bg-slate-50/50 text-slate-400 border border-slate-200/50",
    currentDayCell: isDarkMode
      ? "bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/80 text-slate-100 shadow-lg"
      : "bg-white/90 border-slate-200/60 hover:bg-blue-50/80 text-slate-900 shadow-md",
    todayBorder: isDarkMode
      ? "border-blue-400/80 border-2 shadow-blue-400/20 shadow-lg"
      : "border-blue-600/80 border-2 shadow-blue-600/20 shadow-lg",
    appointmentCard: isDarkMode
      ? "bg-gradient-to-r from-blue-900/90 to-indigo-900/90 text-blue-100 border border-blue-800/50"
      : "bg-gradient-to-r from-blue-50/90 to-indigo-50/90 text-slate-700 border border-blue-200/50",
    appointmentName: isDarkMode ? "text-blue-200" : "text-slate-800",
    appointmentTime: isDarkMode ? "text-blue-300" : "text-blue-700",
    appointmentDoctor: isDarkMode ? "text-indigo-300" : "text-indigo-700",
    moreText: isDarkMode
      ? "text-blue-400 bg-slate-700/50 border border-blue-600/30"
      : "text-blue-600 bg-blue-50/80 border border-blue-200/50",
    navButtons: isDarkMode
      ? "bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50 shadow-lg"
      : "bg-white/90 hover:bg-slate-50/90 text-slate-700 border border-slate-300/50 shadow-md",
    monthTitle: isDarkMode ? "text-blue-300" : "text-slate-800",
    weekdayHeaders: isDarkMode ? "text-slate-300" : "text-slate-700",
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
            className={`p-3 h-32 ${themeStyles.prevNextMonth} text-sm text-center rounded-xl select-none transition-all duration-300 backdrop-blur-sm`}
          >
            <div className="font-medium opacity-60">{format(prevDate, "d")}</div>
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
            className={`p-3 h-32 ${themeStyles.prevNextMonth} text-sm text-center rounded-xl select-none transition-all duration-300 backdrop-blur-sm`}
          >
            <div className="font-medium opacity-60">{format(nextDate, "d")}</div>
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
            className={`border p-3 h-32 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm ${themeStyles.currentDayCell} ${isToday ? themeStyles.todayBorder : ""
              }`}
            onClick={() => onDateClick(dateStr)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`text-sm font-bold ${isToday ? "text-blue-600" : ""}`}>
                {dayCounter}
              </div>
              {dailyAppointments.length > 0 && (
                <div
                  className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-blue-400" : "bg-blue-600"
                    } animate-pulse`}
                ></div>
              )}
            </div>

            <div className="space-y-1">
              {dailyAppointments.slice(0, 2).map((appt, idx) => (
                <div
                  key={idx}
                  className={`text-xs ${themeStyles.appointmentCard} px-2 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm`}
                >
                  <div className={`font-semibold truncate ${themeStyles.appointmentName}`}>
                    {appt.name}
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className={`text-xs font-medium ${themeStyles.appointmentTime}`}>
                      {appt.time}
                    </span>
                    <span className={`text-xs italic ${themeStyles.appointmentDoctor}`}>
                      {appt.doctor}
                    </span>
                  </div>
                </div>
              ))}
              {dailyAppointments.length > 2 && (
                <div
                  className={`text-xs px-2 py-1 rounded-lg text-center font-medium ${themeStyles.moreText} backdrop-blur-sm`}
                >
                  +{dailyAppointments.length - 2} more
                </div>
              )}
            </div>
          </div>
        );

        dayCounter++;
      }
    }

    rows.push(
      <div className="grid grid-cols-7 gap-3" key={week}>
        {days}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${themeStyles.navButtons} backdrop-blur-sm`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <span className="font-medium">Previous</span>
        </button>

        <div className="text-center">
          <h2 className={`text-2xl font-bold tracking-tight ${themeStyles.monthTitle}`}>
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Patient Appointments
          </p>
        </div>

        <button
          onClick={() =>
            setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${themeStyles.navButtons} backdrop-blur-sm`}
        >
          <span className="font-medium">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div
        className={`grid grid-cols-7 text-center font-bold ${themeStyles.weekdayHeaders} text-sm py-4 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-slate-50/50"
          } backdrop-blur-sm`}
      >
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
          (day) => (
            <div className="py-2" key={day}>
              {day}
            </div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">{rows}</div>

      {/* Stats */}
      <div
        className={`mt-6 p-4 rounded-xl ${isDarkMode ? "bg-slate-800/40" : "bg-slate-50/60"
          } backdrop-blur-sm border ${isDarkMode ? "border-slate-700/50" : "border-slate-200/50"}`}
      >
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`} />
              <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>
                Appointments This Month:{" "}
                {
                  appointments.filter((appt) =>
                    appt.date.startsWith(format(currentMonth, "yyyy-MM"))
                  ).length
                }
              </span>
            </div>
          </div>
          <div className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Click any date to manage appointments
          </div>
        </div>
      </div>

      
    </div>
  );
}
