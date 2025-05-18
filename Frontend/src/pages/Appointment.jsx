import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doctors as doctorsData } from "../assets/assets";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const foundDoctor = doctorsData.find((d) => d._id === docId);
    if (foundDoctor) setDocInfo(foundDoctor);
  }, [docId]);

  const timeSlots = [
    "03:00 pm",
    "03:30 pm",
    "04:00 pm",
    "04:30 pm",
    "05:00 pm",
    "05:30 pm",
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time");
      return;
    }

    const newBooking = {
      doctorId: docInfo._id,
      doctorName: docInfo.name,
      speciality: docInfo.speciality,
      date: selectedDate,
      time: selectedTime,
    };

    const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
    localStorage.setItem("appointments", JSON.stringify([...existing, newBooking]));
    setBookingConfirmed(true);
  };

  if (!docInfo) return <div className="p-10 text-center">Loading doctor info...</div>;

  const today = new Date();
  const getNext7Days = () => {
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img src={docInfo.image} alt={docInfo.name} className="w-48 h-48 object-cover rounded-lg" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{docInfo.name}</h2>
          <p className="text-sm text-gray-600">{docInfo.speciality}</p>
          <p className="text-gray-700 mt-2">{docInfo.about}</p>
          <p className="mt-3 font-medium">Appointment fee: $50</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Booking slots</h3>

        
        <div className="flex gap-3 overflow-auto mb-6">
          {getNext7Days().map((d) => {
            const label = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
            const iso = d.toISOString().split("T")[0];
            return (
              <button
                key={iso}
                onClick={() => setSelectedDate(iso)}
                className={`px-4 py-2 rounded-full border text-sm min-w-[72px] transition-all duration-200 ${
                  selectedDate === iso
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                selectedTime === time
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {!bookingConfirmed ? (
          <button
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
            className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all"
          >
            Book an appointment
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mt-4">
            <p className="text-green-800 font-medium">Appointment confirmed for {selectedDate} at {selectedTime}</p>
            <button
              onClick={() => navigate("/my-appointments")}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md"
            >
              View My Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
