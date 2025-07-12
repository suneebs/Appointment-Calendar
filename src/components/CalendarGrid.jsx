import {
  startOfMonth,
  endOfMonth,
  getDay,
  format,
  isSameDay,
} from "date-fns";
import { useState } from "react";
import AppointmentModal from "./AppointmentModal";

export default function CalendarGrid({ appointments, onSave, isDarkMode }) {
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
  const startWeekday = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const totalDays = parseInt(format(monthEnd, "d"));

  const rows = [];
  let dayCounter = 1;
  let nextMonthDay = 1;

  const totalCells = startWeekday + totalDays;
  const totalWeeks = Math.ceil(totalCells / 7);

  // Theme-based styling
  const themeStyles = {
    prevNextMonth: isDarkMode 
      ? "bg-gray-800 text-gray-500" 
      : "bg-gray-100 text-gray-400",
    currentDayCell: isDarkMode 
      ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200" 
      : "bg-white border-gray-200 hover:bg-blue-50 text-gray-900",
    todayBorder: isDarkMode 
      ? "border-blue-400 border-2" 
      : "border-blue-600 border-2",
    appointmentCard: isDarkMode 
      ? "bg-blue-900 text-blue-100" 
      : "bg-blue-100 text-gray-700",
    appointmentName: isDarkMode 
      ? "text-blue-200" 
      : "text-gray-800",
    moreText: isDarkMode 
      ? "text-blue-400" 
      : "text-blue-600",
    navButtons: isDarkMode 
      ? "bg-gray-700 hover:bg-gray-600 text-gray-200" 
      : "bg-gray-200 hover:bg-gray-300 text-gray-700",
    monthTitle: isDarkMode 
      ? "text-blue-400" 
      : "text-blue-700",
    weekdayHeaders: isDarkMode 
      ? "text-gray-300" 
      : "text-gray-600"
  };

  for (let week = 0; week < totalWeeks; week++) {
    const days = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const cellIndex = week * 7 + weekday;

      if (cellIndex < startWeekday) {
        // Leading greyed-out days from previous month
        const prevDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          -(startWeekday - weekday - 1)
        );

        days.push(
          <div
            key={`prev-${week}-${weekday}`}
            className={`p-2 h-28 ${themeStyles.prevNextMonth} text-xs text-center rounded select-none transition-colors duration-200`}
          >
            {format(prevDate, "d")}
          </div>
        );
      } else if (dayCounter > totalDays) {
        // Trailing greyed-out days from next month
        const nextDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          nextMonthDay++
        );

        days.push(
          <div
            key={`next-${week}-${weekday}`}
            className={`p-2 h-28 ${themeStyles.prevNextMonth} text-xs text-center rounded select-none transition-colors duration-200`}
          >
            {format(nextDate, "d")}
          </div>
        );
      } else {
        const date = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          dayCounter
        );
        const dateStr = format(date, "yyyy-MM-dd");
        const dailyAppointments = appointments.filter(
          (appt) => appt.date === dateStr
        );
        const isToday = isSameDay(date, new Date());

        days.push(
          <div
            key={dateStr}
            className={`border p-2 h-28 overflow-auto rounded shadow-sm cursor-pointer transition-all duration-200 ${themeStyles.currentDayCell} ${
              isToday ? themeStyles.todayBorder : ""
            }`}
            onClick={() => handleDayClick(dateStr)}
          >
            <div className="text-xs font-bold">{dayCounter}</div>
            <div className="mt-1 space-y-1">
              {dailyAppointments.slice(0, 3).map((appt, idx) => (
                <div
                  key={idx}
                  className={`text-[11px] ${themeStyles.appointmentCard} px-1 py-0.5 rounded transition-colors duration-200`}
                >
                  <div className={`font-semibold ${themeStyles.appointmentName}`}>
                    {appt.name}
                  </div>
                  {appt.time} — <span className="italic">{appt.doctor}</span>
                </div>
              ))}
              {dailyAppointments.length > 3 && (
                <div className={`text-[10px] ${themeStyles.moreText}`}>
                  + more
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() =>
            setCurrentMonth(
              (prev) =>
                new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
            )
          }
          className={`text-sm ${themeStyles.navButtons} px-3 py-1 rounded transition-colors duration-200`}
        >
          ← Prev
        </button>

        <h2 className={`text-xl font-semibold text-center ${themeStyles.monthTitle} transition-colors duration-200`}>
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(
              (prev) =>
                new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
            )
          }
          className={`text-sm ${themeStyles.navButtons} px-3 py-1 rounded transition-colors duration-200`}
        >
          Next →
        </button>
      </div>

      {/* Weekdays */}
      <div className={`grid grid-cols-7 text-center font-semibold ${themeStyles.weekdayHeaders} text-sm transition-colors duration-200`}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">{rows}</div>

      {/* Appointment Modal */}
      {showModal && selectedDate && (
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