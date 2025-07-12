import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"; // optional, Tailwind icons

const PATIENTS = ["John Doe", "Jane Smith", "Alice Roy", "David Paul"];
const DOCTORS = ["Dr. Smith", "Dr. Emily", "Dr. Raj", "Dr. Kavya"];

export default function AppointmentModal({ selectedDate, onClose, onSave, appointments }) {
  const dailyAppointments = appointments.filter((a) => a.date === selectedDate);

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    // Reset form when modal opens
    setShowForm(false);
    setEditingIndex(null);
    setPatient("");
    setDoctor("");
    setTime("");
  }, [selectedDate]);

  const handleEdit = (index) => {
    const appt = dailyAppointments[index];
    setPatient(appt.name);
    setDoctor(appt.doctor);
    setTime(appt.time);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const toDelete = dailyAppointments[index];
    const updated = appointments.filter(
      (a) =>
        !(
          a.date === selectedDate &&
          a.time === toDelete.time &&
          a.name === toDelete.name &&
          a.doctor === toDelete.doctor
        )
    );
    onSave(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patient || !doctor || !time) return alert("Fill all fields");

    const newAppt = {
      date: selectedDate,
      time,
      name: patient,
      doctor,
    };

    let updated;
    if (editingIndex !== null) {
      const globalIndex = appointments.findIndex(
        (a) =>
          a.date === selectedDate &&
          a.time === dailyAppointments[editingIndex].time &&
          a.name === dailyAppointments[editingIndex].name &&
          a.doctor === dailyAppointments[editingIndex].doctor
      );
      updated = [...appointments];
      updated[globalIndex] = newAppt;
    } else {
      updated = [...appointments, newAppt];
    }

    onSave(updated);
    setShowForm(false);
    setEditingIndex(null);
    setPatient("");
    setDoctor("");
    setTime("");
  };

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-700">Appointments on {selectedDate}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Appointment List */}
        {dailyAppointments.length > 0 ? (
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {dailyAppointments.map((appt, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-3 py-2 bg-blue-50 rounded border text-sm"
              >
                <div>
                  <div className="font-medium text-gray-800">{appt.name}</div>
                  <div className="text-xs text-gray-600">
                    {appt.time} — {appt.doctor}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(idx)} title="Edit">
                    <PencilIcon className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                  </button>
                  <button onClick={() => handleDelete(idx)} title="Delete">
                    <TrashIcon className="h-4 w-4 text-red-600 hover:text-red-800" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic mb-4">No appointments for this day.</div>
        )}

        {/* New Appointment Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm mb-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Appointment
          </button>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex justify-between">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => {
                  setShowForm(false);
                  setPatient("");
                  setDoctor("");
                  setTime("");
                  setEditingIndex(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
