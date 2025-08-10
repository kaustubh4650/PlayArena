import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
    getAllUsers,
    getAllManagers,
    deleteManagerById,
    getUserById,
    getManagerById,
    registerManager,
    getReviewsByTurfId,
    getAllTurfs,
    getBookingsByTurfId,
    getBookingById
} from "../../api/adminApi";

const AdminDashboard = () => {
    const { token } = useAuth();
    const { viewType } = useOutletContext();

    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formData, setFormData] = useState({});
    const [turfs, setTurfs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [filteredBookings, setFilteredBookings] = useState([]);

    const [errors, setErrors] = useState({});
    const [newManager, setNewManager] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        setSelected(null);
        if (viewType === "USERS") {
            getAllUsers(token).then(setUsers);
        } else if (viewType === "MANAGERS") {
            getAllManagers(token).then(setManagers);
        } else if (viewType === "REVIEWS" || viewType === "BOOKINGS") {
            getAllTurfs(token).then(setTurfs);
            setFormData({});
            setReviews([]);
        }
    }, [viewType, token]);

    const validateForm = () => {
        let newErrors = {};

        if (!/^[A-Za-z\s]{3,}$/.test(newManager.name)) {
            newErrors.name = "Name must be at least 3 letters and contain only letters";
        }
        if (!/\S+@\S+\.\S+/.test(newManager.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newManager.password)) {
            newErrors.password = "Password must be at least 6 characters and contain letters and numbers";
        }
        if (!/^[0-9]{10}$/.test(newManager.phone)) {
            newErrors.phone = "Phone must be exactly 10 digits";
        }
        if (newManager.address.trim().length < 3) {
            newErrors.address = "Address must be at least 3 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const viewDetails = async (id, type) => {
        const data =
            type === "USER" ? await getUserById(id, token) : await getManagerById(id, token);
        setSelected(data);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        await deleteManagerById(id, token);
        getAllManagers(token).then(setManagers);
        toast.success("Manager Removed !", {
            position: "top-center",
            autoClose: 2000,
        });
        setSelected(null);
    };

    const handleAddManagerSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        await registerManager(newManager, token);
        toast.success("Manager Registered !", {
            position: "top-center",
            autoClose: 2000,
        });

        getAllManagers(token).then(setManagers);
        setNewManager({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
        setErrors({});
    };

    const fetchReviews = async (turfId) => {
        try {
            const data = await getReviewsByTurfId(turfId, token);
            setReviews(data);
        } catch (err) {
            alert("Failed to fetch reviews.");
            console.error(err);
        }
    };

    const fetchBookings = async (turfId) => {
        try {
            const data = await getBookingsByTurfId(turfId, token);
            setBookings(data);
            setFilteredBookings(data);
        } catch (err) {
            alert("Failed to fetch bookings.");
            console.error(err);
        }
    };

    const handleViewBooking = async (bookingId) => {
        try {
            const data = await getBookingById(bookingId, token);
            setBookingDetails(data);
            setShowModal(true);
        } catch (err) {
            alert("Failed to fetch booking details.");
            console.error(err);
        }
    };



    return (
        <div>
            <ToastContainer />


            {viewType === "ADD_MANAGER" && (

                <form
                    onSubmit={handleAddManagerSubmit}
                    className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4"
                >
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        Add New Manager
                    </h2>

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newManager.name}
                        onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newManager.email}
                        onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newManager.password}
                        onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <input
                        type="text"
                        placeholder="Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newManager.phone}
                        onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                        maxLength={10}
                        required
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}


                    <input
                        type="text"
                        placeholder="Address"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newManager.address}
                        onChange={(e) => setNewManager({ ...newManager, address: e.target.value })}
                        required
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Create Manager
                        </button>
                    </div>
                </form>

            )}

            {(viewType === "USERS" || viewType === "MANAGERS") && (

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-300 text-black uppercase text-sm rounded-t-lg">
                            <tr>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {(viewType === "USERS" ? users : managers).map((item) => {
                                const id = item.userid || item.managerId;
                                return (
                                    <tr key={id} className="hover:bg-gray-200 transition-colors">
                                        <td className="px-6 py-3">{item.name}</td>
                                        <td className="px-6 py-3">{item.email}</td>
                                        <td className="px-6 py-3">{item.phone}</td>
                                        <td className="px-6 py-3 space-x-2">
                                            <button
                                                onClick={() =>
                                                    viewDetails(id, viewType === "USERS" ? "USER" : "MANAGER")
                                                }
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                View
                                            </button>
                                            {viewType === "MANAGERS" && (
                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            )}


            {viewType === "REVIEWS" && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Select Turf to View Reviews</h2>

                    <select
                        className="border p-2 w-full mb-4"
                        value={formData.turfId || ""}
                        onChange={(e) => {
                            const turfId = e.target.value;
                            setFormData((prev) => ({ ...prev, turfId }));
                            fetchReviews(turfId);
                        }}
                        required
                    >
                        <option value="">Select Turf</option>
                        {turfs.map((turf) => (
                            <option key={turf.turfId} value={turf.turfId}>
                                {turf.name}
                            </option>
                        ))}
                    </select>

                    {reviews.length > 0 ? (

                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="w-full border-collapse border border-gray-300 text-md">
                                <thead className="bg-gray-300 text-black uppercase text-sm rounded-t-lg">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Review ID</th>
                                        <th className="px-6 py-3 text-left">User</th>
                                        <th className="px-6 py-3 text-left">Rating</th>
                                        <th className="px-6 py-3 text-left">Comment</th>
                                        <th className="px-6 py-3 text-left">Date</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {reviews.map((review) => (
                                        <tr key={review.reviewId} className="hover:bg-gray-200 transition-colors">
                                            <td className="px-6 py-3">{review.reviewId}</td>
                                            <td className="px-6 py-3">{review.userName}</td>
                                            <td className="px-6 py-3">{review.rating}</td>
                                            <td className="px-6 py-3">{review.comment}</td>
                                            <td className="px-6 py-3">{review.reviewedOn.slice(0, 10)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    ) : (
                        formData.turfId && (
                            <p className="text-sm text-gray-500">
                                No reviews available for this turf.
                            </p>
                        )
                    )}
                </div>
            )}

            {viewType === "BOOKINGS" && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Select Turf to View Bookings</h2>
                    <select
                        className="border p-2 w-full mb-4"
                        value={formData.turfId || ""}
                        onChange={(e) => {
                            const turfId = e.target.value;
                            setFormData((prev) => ({ ...prev, turfId }));
                            fetchBookings(turfId);
                        }}
                        required
                    >
                        <option value="">Select Turf</option>
                        {turfs.map((turf) => (
                            <option key={turf.turfId} value={turf.turfId}>
                                {turf.name}
                            </option>
                        ))}
                    </select>

                    {filteredBookings.length > 0 ? (

                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="w-full border-collapse border border-gray-300 text-md">
                                <thead className="bg-gray-300 text-black uppercase text-sm rounded-t-lg">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Booking ID</th>
                                        <th className="px-6 py-3 text-left">User</th>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Time</th>
                                        <th className="px-6 py-3 text-left">Amount</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {[...filteredBookings]
                                        .sort((a, b) => a.bookingId - b.bookingId)
                                        .map((booking) => (
                                            <tr key={booking.bookingId} className="hover:bg-gray-200 transition-colors">
                                                <td className="px-6 py-3">{booking.bookingId}</td>
                                                <td className="px-6 py-3">{booking.userName}</td>
                                                <td className="px-6 py-3">{booking.slotDate}</td>
                                                <td className="px-6 py-3">{booking.startTime} - {booking.endTime}</td>
                                                <td className="px-6 py-3">₹{booking.amount}</td>
                                                <td className="px-6 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-white text-sm font-semibold
                                    ${booking.status === "CONFIRMED" ? "bg-green-600" : ""}
                                    ${booking.status === "CANCELLED" ? "bg-red-600" : ""}
                                  
                                `}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <button
                                                        onClick={() => handleViewBooking(booking.bookingId)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>


                    ) : (
                        formData.turfId && (
                            <p className="text-sm text-gray-500">
                                No bookings available for this turf.
                            </p>
                        )
                    )}
                </div>
            )}



            {showModal && selected && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Details</h2>
                        <ul className="text-sm space-y-2">
                            <li><strong>Name:</strong> {selected.name}</li>
                            <li><strong>Email:</strong> {selected.email}</li>
                            <li><strong>Phone:</strong> {selected.phone}</li>
                            <li><strong>Address:</strong> {selected.address}</li>
                            <li><strong>Role:</strong> {selected.role}</li>
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
            )}

            {showModal && bookingDetails && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
                        <ul className="text-sm space-y-2">
                            <li><strong>Booking ID:</strong> {bookingDetails.bookingId}</li>
                            <li><strong>User:</strong> {bookingDetails.userName}</li>
                            <li><strong>Turf:</strong> {bookingDetails.turfName}</li>
                            <li><strong>Date:</strong> {bookingDetails.slotDate}</li>
                            <li><strong>Time:</strong> {bookingDetails.startTime} - {bookingDetails.endTime}</li>
                            <li><strong>Status:</strong> {bookingDetails.status}</li>
                            <li><strong>Amount:</strong> ₹{bookingDetails.amount}</li>
                            <li><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</li>
                            <li><strong>Payment Date:</strong> {bookingDetails.paymentDate?.slice(0, 10)}</li>
                        </ul>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setBookingDetails(null);
                                }}
                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AdminDashboard;

