import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { FaMapMarkerAlt, FaRupeeSign, FaTag, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createBooking, createRazorpayOrder, validateSlotAvailability } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";

import {
    getTurfById,
    getSlotsByTurfId,
    getReviewsByTurfId,
} from "../api/turfApi";

const TurfDetails = () => {
    const { turfId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();


    const [turf, setTurf] = useState(null);
    const [slots, setSlots] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const turfData = await getTurfById(turfId);
                const slotData = await getSlotsByTurfId(turfId);
                const reviewData = await getReviewsByTurfId(turfId);

                setTurf(turfData);
                setSlots(slotData);
                setReviews(reviewData);
            } catch (err) {
                console.error("Error fetching turf details", err);
            }
        };

        fetchData();
    }, [turfId]);


    const handleBookNow = async () => {
        if (!selectedSlot || !selectedDate) {
            toast.error("Please select a slot and date!", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
            navigate("/login", {
                state: { from: location },
            });
            return;
        }

        try {

            const isAvailable = await validateSlotAvailability(selectedSlot.slotId, selectedDate, token);
            if (!isAvailable) {
                toast.error("❌ This slot is already booked for the selected date. Please choose another slot.", {
                    position: "top-center",
                    autoClose: 2000,
                });
                return;
            }


            const orderPayload = {
                slotId: selectedSlot.slotId,
                userId: Number(userId),
                bookingDate: selectedDate,
                status: "CONFIRMED",
            };

            const { orderId, amount, currency, key } = await createRazorpayOrder(orderPayload, token);


            const options = {
                key,
                amount,
                currency,
                name: "PlayArena Turf Booking",
                description: "Booking payment",
                order_id: orderId,
                handler: async function (response) {
                    const payment = {
                        status: "SUCCESS"
                    };

                    const bookingData = {
                        slotId: selectedSlot.slotId,
                        userId: Number(userId),
                        bookingDate: selectedDate,
                        status: "CONFIRMED",
                        payment
                    };

                    const bookingRes = await createBooking(bookingData, token);
                    toast.success("Booking successful !", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                    navigate("/");
                },
                theme: {
                    color: "#0f9d58",
                },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                toast.error("❌ Payment failed. Please try again.", {
                    position: "top-center",
                    autoClose: 2000,
                });

            });

            rzp.open();
        } catch (error) {
            toast.error("Something went wrong. Please try again.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };



    if (!turf) return <div className="p-6">Loading...</div>;

    return (

        <div className="p-6 max-w-6xl mx-auto space-y-8">

            <ToastContainer />

            <div className="flex flex-col md:flex-row gap-6">

                <img
                    src={turf.imagePath ? `http://localhost:8080/${turf.imagePath}` : "/default-turf.jpg"}
                    alt={turf.name}
                    className="w-full md:w-1/2 h-72 object-cover rounded-xl shadow-md"
                />


                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold">{turf.name}</h1>
                    <p className="text-gray-600 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" /> {turf.location}
                    </p>
                    <p className="text-green-600 flex items-center gap-2 text-lg font-semibold">
                        <FaRupeeSign /> {turf.pricePerHour}/hr
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                        <FaTag className="text-purple-500" /> {turf.category.toLowerCase()}
                    </p>
                    <p className="text-gray-600">{turf.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <label className="mb-2 font-medium flex items-center gap-2">
                        <FaCalendarAlt /> Select Date:
                    </label>
                    <input
                        type="date"
                        className="border rounded px-4 py-2 w-full"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-2 font-medium flex items-center gap-2">
                        <FaClock /> Select Slot:
                    </label>
                    <select
                        value={selectedSlot?.slotId || ""}
                        onChange={(e) => {
                            const selected = slots.find(slot => slot.slotId === parseInt(e.target.value));
                            setSelectedSlot(selected);
                        }}
                        className="border rounded px-4 py-2 w-full"
                    >
                        <option value="">-- Choose a slot --</option>
                        {slots.map((slot) => (
                            <option
                                key={slot.slotId}
                                value={slot.slotId}
                                disabled={slot.status === "BOOKED"}
                            >
                                {slot.startTime} - {slot.endTime} ({slot.status})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedSlot && (
                <div className="p-4 border rounded bg-blue-50 mt-4">
                    <p className="font-medium">
                        Selected Slot: {selectedSlot.startTime} - {selectedSlot.endTime}
                    </p>
                    <p className="text-sm">Status: {selectedSlot.status}</p>
                </div>
            )}

            <button
                onClick={handleBookNow}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
                Book Now
            </button>


            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-2">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.reviewId}
                            className="border rounded-2xl shadow-md p-4 mb-4 bg-white flex justify-between items-start sm:items-center transition hover:shadow-lg"
                        >
                            <div className="flex gap-4 items-start max-w-[80%]">
                                <Avatar name={review.userName} size="48" round="50%" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{review.userName}</p>
                                    <p className="text-base text-gray-600 mt-1 break-words">{review.comment}</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Reviewed on: {review.reviewedOn.slice(0, 10)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-yellow-500 text-xl font-bold ml-4 whitespace-nowrap self-start">
                                ⭐ {review.rating}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TurfDetails;
