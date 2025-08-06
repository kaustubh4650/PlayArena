import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
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

    const viewDetails = async (id, type) => {
        const data =
            type === "USER" ? await getUserById(id, token) : await getManagerById(id, token);
        setSelected(data);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        await deleteManagerById(id, token);
        getAllManagers(token).then(setManagers);
        setSelected(null);
    };

    const handleAddManagerSubmit = async (e) => {
        e.preventDefault();
        await registerManager(newManager, token);
        getAllManagers(token).then(setManagers);
        setNewManager({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
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
            {viewType === "ADD_MANAGER" && (
                <form
                    onSubmit={handleAddManagerSubmit}
                    className="max-w-md space-y-4 bg-gray-100 p-4 rounded shadow mb-6"
                >
                    <h2 className="text-lg font-bold">Add New Manager</h2>
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 border"
                        value={newManager.name}
                        onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border"
                        value={newManager.email}
                        onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border"
                        value={newManager.password}
                        onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        className="w-full p-2 border"
                        value={newManager.phone}
                        onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="w-full p-2 border"
                        value={newManager.address}
                        onChange={(e) => setNewManager({ ...newManager, address: e.target.value })}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Create Manager
                    </button>
                </form>
            )}

            {(viewType === "USERS" || viewType === "MANAGERS") && (
                <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(viewType === "USERS" ? users : managers).map((item) => {
                            const id = item.userid || item.managerId;
                            return (
                                <tr key={id} className="border-t">
                                    <td className="px-4 py-2">{item.name}</td>
                                    <td className="px-4 py-2">{item.email}</td>
                                    <td className="px-4 py-2">{item.phone}</td>
                                    <td className="px-4 py-2 space-x-2">
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
                        <table className="w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Review ID</th>
                                    <th className="border p-2">User</th>
                                    <th className="border p-2">Rating</th>
                                    <th className="border p-2">Comment</th>
                                    <th className="border p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.reviewId}>
                                        <td className="border p-2">{review.reviewId}</td>
                                        <td className="border p-2">{review.userName}</td>
                                        <td className="border p-2">{review.rating}</td>
                                        <td className="border p-2">{review.comment}</td>
                                        <td className="border p-2">
                                            {review.reviewedOn.slice(0, 10)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                    {/* Table */}
                    {filteredBookings.length > 0 ? (
                        <table className="w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Booking ID</th>
                                    <th className="border p-2">User</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Time</th>
                                    <th className="border p-2">Amount</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredBookings]
                                    .sort((a, b) => a.bookingId - b.bookingId)
                                    .map((booking) => (
                                        <tr key={booking.bookingId}>
                                            <td className="border p-2">{booking.bookingId}</td>
                                            <td className="border p-2">{booking.userName}</td>
                                            <td className="border p-2">{booking.slotDate}</td>
                                            <td className="border p-2">{booking.startTime} - {booking.endTime}</td>
                                            <td className="border p-2">₹{booking.amount}</td>
                                            <td className="border p-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-white text-sm font-semibold
                                            ${booking.status === "CONFIRMED" ? "bg-green-600" : ""}
                                            ${booking.status === "CANCELLED" ? "bg-red-600" : ""}
                                            ${booking.status === "BOOKED" ? "bg-blue-600" : ""}
                                        `}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="border p-2">
                                                <button
                                                    onClick={() => handleViewBooking(booking.bookingId)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
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

