export const loadAppointments = () => {
  const data = localStorage.getItem("appointments");
  return data ? JSON.parse(data) : [];
};

export const saveAppointments = (appointments) => {
  localStorage.setItem("appointments", JSON.stringify(appointments));
};
