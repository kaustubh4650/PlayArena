import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getUserById,
    getUserBookings,
    getUserReviews,
    updateUserById,
    changePassword,
    addReview,
    updateReview,
    deleteReview
} from "../../api/userApi";

const UserDashboard = () => {
    const { id, token, name } = useAuth();
    const { viewType, setViewType } = useOutletContext();

    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
    const [passwordData, setPasswordData] = useState({
        email: "",
        oldPassword: "",
        newPassword: ""
    });
    const [reviewData, setReviewData] = useState({ turfId: "", rating: "", comment: "" });
    const [existingReviewId, setExistingReviewId] = useState(null);


    useEffect(() => {
        if (viewType === "DASHBOARD") {
            getUserById(id, token).then(setUser);
        } else if (viewType === "ALL_REVIEWS" || viewType === "ADD_REVIEW") {
            getUserReviews(id, token).then(setReviews);
            getUserBookings(id, token).then(setBookings);
        } else if (viewType === "UPDATE_PROFILE") {
            getUserById(id, token).then((data) => {
                setFormData({
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                });
            });
        } else if (viewType === "MY_BOOKINGS") {
            getUserBookings(id, token).then(setBookings);
        }
    }, [viewType, id, token]);

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordData, token);
            alert("Password updated successfully!");
            setPasswordData({ email: "", oldPassword: "", newPassword: "" });
        } catch (err) {
            alert("Failed to update password. " + (err.response?.data?.message || ""));
        }
    };


    const handleChange = (e) => {
        // setFormData({ ...formData, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        if (viewType === "UPDATE_PROFILE") {
            setFormData({ ...formData, [name]: value });
        } else if (viewType === "ADD_REVIEW") {
            if (name === "turfId") {

                const existingReview = reviews.find(r => r.turfId.toString() === value);
                if (existingReview) {
                    setReviewData({
                        turfId: value,
                        rating: existingReview.rating,
                        comment: existingReview.comment,
                    });
                    setExistingReviewId(existingReview.reviewId);
                } else {
                    setReviewData({
                        turfId: value,
                        rating: "",
                        comment: "",
                    });
                    setExistingReviewId(null);
                }
            } else {
                setReviewData({ ...reviewData, [name]: value });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserById(id, formData, token);
            alert("Profile updated successfully!");
            setFormData({
                name: "", address: "", phone: ""
            })
        } catch (err) {
            alert("Error updating profile:", err);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            if (existingReviewId) {
                await updateReview(existingReviewId, {
                    rating: reviewData.rating,
                    comment: reviewData.comment
                }, token);
                alert("Review updated successfully!");
            } else {
                await addReview(reviewData.turfId, id, {
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                }, token);
                alert("Review added successfully!");
            }

            setReviewData({ turfId: "", rating: "", comment: "" });
            setExistingReviewId(null);
            setViewType("ALL_REVIEWS");
            // getUserReviews(id, token).then(setReviews);
        } catch (err) {
            alert("Error submitting review.");
        }
    };

    const handleEditReview = (r) => {
        setReviewData({
            turfId: r.turfId,
            rating: r.rating,
            comment: r.comment
        });
        setExistingReviewId(r.reviewId);
        setViewType("ADD_REVIEW");
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteReview(reviewId, token);
                setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
            } catch {
                alert("Failed to delete review.");
            }
        }
    };

    const uniqueTurfs = Array.from(
        new Map(
            bookings.map((b) => [b.turfId, { turfId: b.turfId, turfName: b.turfName }])
        ).values()
    );

    return (
        <div>
            {viewType === "DASHBOARD" && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Welcome, {name}!</h1>
                    {user && (
                        <div className="mb-6">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.phone}</p>
                            <p><strong>Address:</strong> {user.address}</p>
                        </div>
                    )}
                </div>
            )}

            {viewType === "UPDATE_PROFILE" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Update
                        </button>
                    </form>
                </div>
            )}

            {viewType === "CHANGE_PASSWORD" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={passwordData.email}
                                onChange={handlePasswordChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Update Password
                        </button>
                    </form>
                </div>

            )}

            {viewType === "MY_BOOKINGS" && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
                    <table className="w-full table-auto border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Booking ID</th>
                                <th className="px-4 py-2">Slot</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b.bookingId} className="border-t">
                                    <td className="px-4 py-2">{b.bookingId}</td>
                                    <td className="px-4 py-2">{b.startTime} - {b.endTime}</td>
                                    <td className="px-4 py-2">{b.slotDate}</td>
                                    <td className="px-4 py-2">{b.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {viewType === "ALL_REVIEWS" && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Reviews</h2>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={() => {
                                setReviewData({ turfId: "", rating: "", comment: "" });
                                setExistingReviewId(null);
                                setViewType("ADD_REVIEW");
                            }}
                        >
                            Add Review
                        </button>
                    </div>
                    {reviews.length === 0 ? (
                        <p>No reviews available.</p>
                    ) : (
                        <ul className="space-y-2">
                            {reviews.map((r) => (
                                <li key={r.reviewId} className="p-3 border rounded">
                                    <p><strong>Turf:</strong> {r.turfName}</p>
                                    <p><strong>Rating:</strong> {r.rating}</p>
                                    <p><strong>Comment:</strong> {r.comment}</p>
                                    <p><strong>Date:</strong> {r.reviewedOn.slice(0, 10)}</p>

                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleEditReview(r)} className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
                                        <button onClick={() => handleDeleteReview(r.reviewId)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}


            {viewType === "ADD_REVIEW" && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Add Review</h2>
                    <form onSubmit={handleAddReview} className="space-y-4 max-w-md">
                        <div>
                            <label className="block mb-1 font-medium">Select Turf</label>
                            <select
                                name="turfId"
                                value={reviewData.turfId}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            >
                                <option value="">-- Select Turf --</option>
                                {uniqueTurfs.map((turf) => (
                                    <option key={turf.turfId} value={turf.turfId}>
                                        {turf.turfName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Rating (1 to 5)</label>
                            <input
                                type="number"
                                name="rating"
                                min="1"
                                max="5"
                                value={reviewData.rating}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Comment</label>
                            <textarea
                                name="comment"
                                value={reviewData.comment}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;