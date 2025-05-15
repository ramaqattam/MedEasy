import React, { useEffect, useState } from "react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  const cancelAppointment = (index) => {
    const updated = appointments.filter((_, i) => i !== index);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments booked yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-500">{appointment.speciality}</p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Date:</strong> {appointment.date} <br />
                  <strong>Time:</strong> {appointment.time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => alert("Redirect to payment gateway...")}
                  className="w-20 h-10 text-sm bg-[#A9DFC4] text-gray hover:bg-[#78C6A3] "
                  >
                  Pay Online
                </button>
                <button
                  onClick={() => cancelAppointment(index)}
                  className="w-20 h-10 text-sm text-gray-700 border border-gray  hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
