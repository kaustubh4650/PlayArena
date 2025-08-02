import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getTurfById,
    getSlotsByTurfId,
    getReviewsByTurfId,
} from "../api/turfApi";

const TurfDetails = () => {
    const { turfId } = useParams();
    const navigate = useNavigate();

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

    const handleBookNow = () => {
        if (!selectedSlot || !selectedDate) {
            alert("Please select a slot and date.");
            return;
        }

        const isLoggedIn = localStorage.getItem("token"); // or your auth logic

        if (!isLoggedIn) {
            navigate("/login");
        } else {
            navigate("/user/dashboard"); // Replace with actual dashboard routing
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slots.map((slot) => (
                        <div
                            key={slot.slotId}
                            className={`border rounded p-3 cursor-pointer transition ${selectedSlot?.slotId === slot.slotId
                                ? "bg-blue-500 text-white"
                                : slot.status === "BOOKED"
                                    ? "bg-red-200 cursor-not-allowed"
                                    : "hover:bg-blue-100"
                                }`}
                            onClick={() =>
                                slot.status !== "BOOKED" && setSelectedSlot(slot)
                            }
                        >
                            <p className="font-medium">
                                {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm">{slot.status}</p>
                        </div>
                    ))}
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
                            className="border rounded-2xl shadow-md p-4 mb-4 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center transition hover:shadow-lg"
                        >
                            <div className="mb-2 sm:mb-0">
                                <p className="text-lg font-semibold text-gray-800">{review.userName}</p>
                                <p className="text-base text-gray-600 mt-1">{review.comment}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Reviewed on: {review.reviewedOn.slice(0, 10)}
                                </p>
                            </div>

                            <div className="text-yellow-500 text-xl font-bold sm:ml-4">
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
