import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "react-avatar";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createBooking, createRazorpayOrder, validateSlotAvailability } from "../api/userApi";
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
            alert("Please select a slot and date.");
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
                alert("❌ This slot is already booked for the selected date. Please choose another slot.");
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
                    console.log("Booking successful:", bookingRes);
                    // navigate("/user/dashboard");
                    navigate("/");
                },
                theme: {
                    color: "#0f9d58",
                },
            };

            const rzp = new window.Razorpay(options);

            //  Handle payment failure
            rzp.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert("❌ Payment failed. Please try again.");

            });

            rzp.open();
        } catch (error) {
            console.error("Razorpay order creation failed", error);
            alert("Something went wrong. Please try again.");
        }
    };



    if (!turf) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <img
                src={
                    turf.imagePath
                        ? `http://localhost:8080/${turf.imagePath}`
                        : "/default-turf.jpg"
                }
                alt={turf.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
            />

            <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
            <p className="text-gray-600">{turf.location}</p>
            <p className="text-green-600 font-semibold mb-4">
                ₹{turf.pricePerHour}/hr
            </p>
            <p className="text-gray-700 mb-6">{turf.description}</p>

            <div className="mb-6">
                <label className="block mb-2 font-medium">Select Date:</label>
                <input
                    type="date"
                    className="border rounded px-3 py-2 w-full"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Available Slots</h2>

                <div className="flex flex-col gap-4">
                    <label className="font-medium text-lg">Select a Slot:</label>

                    <select
                        value={selectedSlot?.slotId || ""}
                        onChange={(e) => {
                            const selected = slots.find(slot => slot.slotId === parseInt(e.target.value));
                            setSelectedSlot(selected);
                        }}
                        className="border rounded px-4 py-2 text-base"
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

                    {selectedSlot && (
                        <div className="p-4 border rounded bg-blue-50">
                            <p className="font-medium">
                                Selected Slot: {selectedSlot.startTime} - {selectedSlot.endTime}
                            </p>
                            <p className="text-sm">Status: {selectedSlot.status}</p>
                        </div>
                    )}
                </div>

            </div>

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
