import { useState } from "react";

const PATIENTS = ["John Doe", "Jane Smith", "Alice Roy", "David Paul"];
const DOCTORS = ["Dr. Smith", "Dr. Emily", "Dr. Raj", "Dr. Kavya"];

export default function AppointmentModal({ selectedDate, onClose, onSave }) {
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) return alert("Fill all fields");

    const appointment = {
      date: selectedDate,
      time,
      name: patient,
      doctor,
    };

    onSave(appointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Add Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium mb-1">Patient</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              required
            >
              <option value="">Select patient</option>
              {PATIENTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium mb-1">Doctor</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              required
            >
              <option value="">Select doctor</option>
              {DOCTORS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              className="w-full border px-3 py-2 rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
