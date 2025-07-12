import { useState, useEffect } from "react";
import { format } from "date-fns";
import AppointmentModal from "./AppointmentModal";
import { loadAppointments, saveAppointments } from "../utils/storage"; // Adjust path if needed

export default function DayView({ appointments, onSave }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showModal, setShowModal] = useState(false);

  const handleSave = (appt) => {
    onSave(appt);
    setShowModal(false);
  };

  const dailyAppointments = appointments
    .filter((appt) => appt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white p-4 rounded shadow max-h-[90vh] overflow-y-auto">
      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2 text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Appointments */}
      <div className="flex flex-col gap-3">
        {dailyAppointments.length > 0 ? (
          dailyAppointments.map((appt, idx) => (
            <div
              key={idx}
              className="border-l-4 border-blue-500 bg-blue-50 px-3 py-2 rounded shadow-sm"
            >
              <div className="text-sm font-semibold text-gray-800">{appt.name}</div>
              <div className="text-xs text-gray-600">
                {appt.time} — <span className="italic">{appt.doctor}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic">No appointments</div>
        )}
      </div>

      {/* Add Button */}
      <div className="mt-6">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          + Add Appointment
        </button>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
