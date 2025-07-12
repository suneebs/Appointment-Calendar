import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import { parseISO, isBefore, startOfDay } from "date-fns";

const PATIENTS = ["John Doe", "Jane Smith", "Alice Roy", "David Paul"];
const DOCTORS = ["Dr. Smith", "Dr. Emily", "Dr. Raj", "Dr. Kavya"];

export default function AppointmentModal({ selectedDate, onClose, onSave, appointments, isDarkMode }) {
  const dailyAppointments = appointments.filter((a) => a.date === selectedDate);
  const isPastDate = isBefore(parseISO(selectedDate), startOfDay(new Date()));

  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setShowForm(false);
    setEditingIndex(null);
    setPatient("");
    setDoctor("");
    setTime("");
  }, [selectedDate]);

  // Professional theme styling system
  const themeStyles = {
    modal: {
      background: isDarkMode ? "bg-gray-800" : "bg-white",
      border: isDarkMode ? "border border-gray-700" : "shadow-lg",
      text: isDarkMode ? "text-gray-100" : "text-gray-900"
    },
    header: {
      title: isDarkMode ? "text-blue-400" : "text-blue-700",
      closeButton: isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-black"
    },
    appointments: {
      container: isDarkMode ? "bg-gray-700 border-gray-600" : "bg-blue-50 border-gray-200",
      patientName: isDarkMode ? "text-gray-100" : "text-gray-800",
      details: isDarkMode ? "text-gray-300" : "text-gray-600",
      editIcon: isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800",
      deleteIcon: isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"
    },
    form: {
      label: isDarkMode ? "text-gray-200" : "text-gray-700",
      input: isDarkMode 
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400" 
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500",
      select: isDarkMode 
        ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400" 
        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
    },
    buttons: {
      primary: isDarkMode 
        ? "bg-blue-600 hover:bg-blue-700 text-white" 
        : "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: isDarkMode 
        ? "bg-gray-600 hover:bg-gray-700 text-gray-200" 
        : "bg-gray-200 hover:bg-gray-300 text-gray-700",
      disabled: isDarkMode 
        ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
        : "bg-gray-400 text-gray-600 cursor-not-allowed"
    },
    alerts: {
      error: isDarkMode ? "text-red-400" : "text-red-600",
      info: isDarkMode ? "text-gray-400" : "text-gray-500"
    }
  };

  const handleEdit = (index) => {
    if (isPastDate) return;
    const appt = dailyAppointments[index];
    setPatient(appt.name);
    setDoctor(appt.doctor);
    setTime(appt.time);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (isPastDate) return;
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

    const newAppt = { date: selectedDate, time, name: patient, doctor };

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
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className={`${themeStyles.modal.background} ${themeStyles.modal.border} ${themeStyles.modal.text} rounded-lg p-6 w-full max-w-md transition-all duration-200 transform`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-bold ${themeStyles.header.title} transition-colors duration-200`}>
            Appointments on {selectedDate}
          </h2>
          <button
            onClick={onClose}
            className={`${themeStyles.header.closeButton} font-bold text-lg transition-colors duration-200`}
          >
            ✕
          </button>
        </div>

        {isPastDate && (
          <div className={`text-sm ${themeStyles.alerts.error} mb-3 p-2 rounded ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border ${isDarkMode ? 'border-red-800' : 'border-red-200'} transition-colors duration-200`}>
            Past date — We cannot add or edit appointments.
          </div>
        )}

        {/* Appointment List */}
        {dailyAppointments.length > 0 ? (
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {dailyAppointments.map((appt, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center px-3 py-2 ${themeStyles.appointments.container} rounded border text-sm transition-colors duration-200`}
              >
                <div>
                  <div className={`font-medium ${themeStyles.appointments.patientName}`}>
                    {appt.name}
                  </div>
                  <div className={`text-xs ${themeStyles.appointments.details}`}>
                    {appt.time} — {appt.doctor}
                  </div>
                </div>
                {!isPastDate && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(idx)} 
                      title="Edit"
                      className="transition-colors duration-200"
                    >
                      <PencilIcon className={`h-4 w-4 ${themeStyles.appointments.editIcon}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(idx)} 
                      title="Delete"
                      className="transition-colors duration-200"
                    >
                      <TrashIcon className={`h-4 w-4 ${themeStyles.appointments.deleteIcon}`} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-sm ${themeStyles.alerts.info} italic mb-4 transition-colors duration-200`}>
            No appointments for this day.
          </div>
        )}

        {/* New Appointment Button */}
        {!showForm && !isPastDate && (
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center gap-2 ${themeStyles.buttons.primary} px-4 py-2 rounded text-sm mb-2 transition-colors duration-200`}
          >
            <PlusIcon className="h-4 w-4" />
            New Appointment
          </button>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeStyles.form.label} transition-colors duration-200`}>
                Patient
              </label>
              <select
                className={`w-full ${themeStyles.form.select} px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                required
                disabled={isPastDate}
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
              <label className={`block text-sm font-medium mb-1 ${themeStyles.form.label} transition-colors duration-200`}>
                Doctor
              </label>
              <select
                className={`w-full ${themeStyles.form.select} px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
                disabled={isPastDate}
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
              <label className={`block text-sm font-medium mb-1 ${themeStyles.form.label} transition-colors duration-200`}>
                Time
              </label>
              <input
                type="time"
                className={`w-full ${themeStyles.form.input} px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200`}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                disabled={isPastDate}
              />
            </div>

            <div className="flex justify-between gap-3">
              <button
                type="button"
                className={`${themeStyles.buttons.secondary} px-4 py-2 rounded transition-colors duration-200`}
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
                disabled={isPastDate}
                className={`px-4 py-2 rounded text-white transition-colors duration-200 ${
                  isPastDate
                    ? themeStyles.buttons.disabled
                    : themeStyles.buttons.primary
                }`}
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