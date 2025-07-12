import {
  startOfMonth,
  endOfMonth,
  getDay,
  format,
  isSameDay,
} from "date-fns";
import { useState } from "react";
import AppointmentModal from "./AppointmentModal";

export default function CalendarGrid({ appointments, onSave }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const handleSave = (appt) => {
    onSave(appt);
    setShowModal(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startWeekday = getDay(monthStart); // 0 (Sun) to 6 (Sat)
  const totalDays = parseInt(format(monthEnd, "d")); // number of days in month

  const rows = [];
  let dayCounter = 1;

  for (let week = 0; week < 6; week++) {
    const days = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const cellIndex = week * 7 + weekday;

      if (cellIndex < startWeekday || dayCounter > totalDays) {
        // Empty cell: before start or after end of month
        days.push(
          <div
            key={`empty-${week}-${weekday}`}
            className="p-2 h-28 bg-transparent"
          />
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
            className={`border p-2 h-28 overflow-auto rounded shadow-sm hover:bg-blue-50 cursor-pointer transition duration-150 bg-white ${
              isToday ? "border-blue-600 border-2" : ""
            }`}
            onClick={() => handleDayClick(dateStr)}
          >
            <div className="text-xs font-bold">{dayCounter}</div>
            <div className="mt-1 space-y-1">
              {dailyAppointments.slice(0, 3).map((appt, idx) => (
                <div
                  key={idx}
                  className="text-[11px] text-gray-700 bg-blue-100 px-1 py-0.5 rounded"
                >
                  {appt.time} - {appt.name}
                </div>
              ))}
              {dailyAppointments.length > 3 && (
                <div className="text-[10px] text-blue-600">+ more</div>
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
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ← Prev
        </button>

        <h2 className="text-xl font-semibold text-center text-blue-700">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={() =>
            setCurrentMonth(
              (prev) =>
                new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
            )
          }
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          Next →
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 text-sm">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Grid */}
      <div className="space-y-2">{rows}</div>

      {/* Modal */}
      {showModal && selectedDate && (
        <AppointmentModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
