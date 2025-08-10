import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
    getUserById,
    getUserBookings,
    getUserReviews,
    updateUserById,
    changePassword,
    addReview,
    updateReview,
    deleteReview,
    cancelBooking,
    getBookingById
} from "../../api/userApi";

const UserDashboard = () => {
    const { id, token, name } = useAuth();
    const { viewType, setViewType } = useOutletContext();

    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
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
    const [errors, setErrors] = useState({});


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

    const validateProfileForm = () => {
        let newErrors = {};

        if (!/^[A-Za-z\s]{3,}$/.test(formData.name)) {
            newErrors.name = "Name must be at least 3 letters and contain only letters";
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }
        if (formData.address.trim().length < 3) {
            newErrors.address = "Address must be at least 3 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        let newErrors = {};

        if (!/\S+@\S+\.\S+/.test(passwordData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!passwordData.oldPassword.trim()) {
            newErrors.oldPassword = "Old password is required";
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(passwordData.newPassword)) {
            newErrors.newPassword = "Password must be at least 6 characters and contain both letters and numbers";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateReviewForm = () => {
        const newErrors = {};

        if (!reviewData.turfId) {
            newErrors.turfId = "Please select a turf.";
        }

        if (!reviewData.rating) {
            newErrors.rating = "Rating is required.";
        } else if (reviewData.rating < 1 || reviewData.rating > 5) {
            newErrors.rating = "Rating must be between 1 and 5.";
        }

        if (!reviewData.comment) {
            newErrors.comment = "Comment is required.";
        } else if (reviewData.comment.length < 5) {
            newErrors.comment = "Comment must be at least 5 characters.";
        }

        setErrors(newErrors);
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };


    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;
        try {
            await changePassword(passwordData, token);
            toast.success("Password updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setErrors({});
            setPasswordData({ email: "", oldPassword: "", newPassword: "" });
        } catch (err) {
            toast.error("Failed to update password. ", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };


    const handleChange = (e) => {

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
            if (!validateProfileForm()) return;
            toast.success("Profile updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setErrors({});
            setFormData({
                name: "", address: "", phone: ""
            })
        } catch (err) {
            toast.error("Profile updating failed !", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!validateReviewForm()) { return; }
        try {
            if (existingReviewId) {
                await updateReview(existingReviewId, {
                    rating: reviewData.rating,
                    comment: reviewData.comment
                }, token);
                toast.success("Review updated successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                await addReview(reviewData.turfId, id, {
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                }, token);
                toast.success("Review added successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }

            setReviewData({ turfId: "", rating: "", comment: "" });
            setExistingReviewId(null);
            setViewType("ALL_REVIEWS");
            setErrors({});
        } catch (err) {
            toast.error("Error submitting review.", {
                position: "top-center",
                autoClose: 2000,
            });
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
                toast.success("Review deleted successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
                setReviews(prev => prev.filter(r => r.reviewId !== reviewId));
            } catch {
                toast.error("Failed to delete review.", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        }
    };

    const handleViewDetails = async (bookingId) => {
        try {
            const booking = await getBookingById(bookingId, token);
            setSelectedBooking(booking);
            setShowModal(true);
        } catch (err) {
            toast.error("Failed to load booking details.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await cancelBooking(bookingId, token);
            toast.success("Booking cancelled successfully!", {
                position: "top-center",
                autoClose: 2000,
            });

            const updated = await getUserBookings(id, token);
            setBookings(updated);
        } catch (err) {
            toast.error("Failed to cancel booking.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };



    const uniqueTurfs = Array.from(
        new Map(
            bookings.map((b) => [b.turfId, { turfId: b.turfId, turfName: b.turfName }])
        ).values()
    );

    return (
        <div>

            <ToastContainer />

            {viewType === "DASHBOARD" && (
                <div className="flex  justify-center  bg-gray-100">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">
                            Welcome, {name}!
                        </h1>

                        {user && (
                            <div className="space-y-4 text-gray-700">
                                <p className="flex justify-between border-b pb-2">
                                    <strong>Email:</strong> <span>{user.email}</span>
                                </p>
                                <p className="flex justify-between border-b pb-2">
                                    <strong>Phone:</strong> <span>{user.phone}</span>
                                </p>
                                <p className="flex justify-between">
                                    <strong>Address:</strong> <span>{user.address}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            )}

            {viewType === "UPDATE_PROFILE" && (

                <div className="flex justify-center  bg-gray-100 p-4">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            Update Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your full name"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your address"
                                    required
                                />
                                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your phone number"
                                    required
                                    maxLength={10}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                            </div>


                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors duration-200"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>

            )}

            {viewType === "CHANGE_PASSWORD" && (

                <div className="flex justify-center bg-gray-100 p-4">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            Change Password
                        </h2>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={passwordData.email}
                                    onChange={handlePasswordChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Old Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your old password"
                                    required
                                />
                                {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your new password"
                                    required
                                />
                                {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors duration-200"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>


            )}

            {viewType === "MY_BOOKINGS" && (

                <div>
                    <h2 className="text-2xl font-bold text-center mb-9">Your Bookings</h2>

                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-300 text-black uppercase text-sm">
                                <tr>
                                    <th className="px-6 py-3 text-left">Booking ID</th>
                                    <th className="px-6 py-3 text-left">Slot</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Amount</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                    <th className="px-6 py-3 text-left">Cancel</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {bookings.map((b) => {
                                    const slotDate = new Date(b.slotDate);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const cancelCutoff = new Date(slotDate);
                                    cancelCutoff.setDate(cancelCutoff.getDate() - 1);

                                    const isCancellable = today <= cancelCutoff;

                                    return (
                                        <tr
                                            key={b.bookingId}
                                            className="hover:bg-gray-300 transition-colors"
                                        >
                                            <td className="px-6 py-3">{b.bookingId}</td>
                                            <td className="px-6 py-3">{b.startTime} - {b.endTime}</td>
                                            <td className="px-6 py-3">{b.slotDate}</td>
                                            <td className="px-6 py-3">₹{b.amount}</td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-sm font-medium
                    ${b.status === "CONFIRMED" ? "bg-green-600" : ""}
                    ${b.status === "CANCELLED" ? "bg-red-600" : ""}
                  `}
                                                >
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleViewDetails(b.bookingId)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 ml-2"
                                                >
                                                    View
                                                </button>
                                            </td>
                                            <td className="px-6 py-3">
                                                {b.status === "CONFIRMED" && isCancellable ? (
                                                    <button
                                                        onClick={() => handleCancelBooking(b.bookingId)
                                                        }
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        {b.status === "CONFIRMED" ? "Completed" : "Cancelled"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

            )
            }

            {
                viewType === "ALL_REVIEWS" && (
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
                )
            }


            {
                viewType === "ADD_REVIEW" && (
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
                                {errors.turfId && <p className="text-red-500 text-sm">{errors.turfId}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Rating (1 to 5)</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={reviewData.rating}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                                {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
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
                                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                )
            }


            {
                showModal && selectedBooking && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
                            <ul className="text-sm space-y-2">
                                <li><strong>Booking ID:</strong> {selectedBooking.bookingId}</li>
                                <li><strong>Turf:</strong> {selectedBooking.turfName}</li>
                                <li><strong>Slot:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}</li>
                                <li><strong>Date:</strong> {selectedBooking.slotDate}</li>
                                <li><strong>Status:</strong> {selectedBooking.status}</li>
                                <li><strong>Booked On:</strong> {new Date(selectedBooking.bookedOn).toLocaleString()}</li>
                                <li><strong>Amount:</strong> ₹{selectedBooking.amount}</li>
                                <li><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</li>
                                <li><strong>Payment Date:</strong> {new Date(selectedBooking.paymentDate).toLocaleString()}</li>
                            </ul>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default UserDashboard;