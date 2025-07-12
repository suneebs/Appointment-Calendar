import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";
import AppointmentModal from "./AppointmentModal";
import { loadAppointments, saveAppointments } from "../utils/storage";

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
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");
      const dailyAppointments = appointments.filter((appt) => appt.date === dateStr);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          key={day}
          className={`border p-2 h-28 overflow-auto rounded shadow-sm hover:bg-blue-50 cursor-pointer transition duration-150
            ${!isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : "bg-white"}
            ${isToday ? "border-blue-600 border-2" : ""}
          `}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="text-xs font-bold">{format(day, "d")}</div>
          <div className="mt-1 space-y-1">
            {dailyAppointments.slice(0, 3).map((appt, idx) => (
              <div key={idx} className="text-[11px] text-gray-700 bg-blue-100 px-1 py-0.5 rounded">
                <div className="font-semibold text-gray-800">{appt.name}</div>
                {appt.time} - {appt.doctor}
              </div>
            ))}
            {dailyAppointments.length > 3 && (
              <div className="text-[10px] text-blue-600">+ more</div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div className="grid grid-cols-7 gap-2" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          ← Prev
        </button>

        <h2 className="text-xl font-semibold text-center text-blue-700">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
          Next →
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 text-sm">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
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
