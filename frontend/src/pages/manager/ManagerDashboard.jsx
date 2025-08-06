import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getManagerById,
    updateManagerById,
    changePassword,
    getTurfsByManager,
    deleteTurf,
    createTurf,
    getSlotsByTurfId,
    deleteSlot,
    createSlot,
    getBookingsByTurfId,
    updateSlot,
    updateTurf,
    getTurfById
} from "../../api/managerApi";

import { getReviewsByTurfId } from "../../api/turfApi";

const ManagerDashboard = () => {
    const { token, id } = useAuth();
    const { viewType, setViewType } = useOutletContext();

    const [manager, setManager] = useState({});
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    const [turfs, setTurfs] = useState([]);
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [form, setForm] = useState({});
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [editingTurfId, setEditingTurfId] = useState(null);
    const [selectedTurf, setSelectedTurf] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showTurfModal, setShowTurfModal] = useState(false);



    // Fetch manager and turfs on load
    useEffect(() => {
        if (id && token) {
            getManagerById(id, token).then(data => {
                setManager(data);
                setFormData(data); // for update
                setPasswordData(prev => ({ ...prev, email: data.email }));
            });
            getTurfsByManager(id, token).then(setTurfs);
        }
    }, [id, token]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (viewType === "VIEW_BOOKINGS" && formData.turfId) {
                const data = await getBookingsByTurfId(formData.turfId, token);
                setBookings(data);
            }
        };
        fetchBookings();
    }, [viewType, formData.turfId, token]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (formData.turfId) {
                const data = await getSlotsByTurfId(formData.turfId, token);
                setSlots(data); // Replaces the old list
            } else {
                setSlots([]);
            }
        };

        fetchSlots();
    }, [formData.turfId, token]);



    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        await updateManagerById(id, formData, token);
        alert("Profile updated successfully!");
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordData, token);
            alert("Password changed successfully!");
        } catch (error) {
            alert("Failed to change password. Please try again.");
        }
    };


    const handleSubmitTurf = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", form.name);
        formDataToSend.append("location", form.location);
        formDataToSend.append("description", form.description);
        formDataToSend.append("pricePerHour", form.pricePerHour);
        if (form.image) formDataToSend.append("image", form.image);

        try {
            if (editingTurfId) {
                await updateTurf(editingTurfId, formDataToSend, token);
                alert("Turf updated successfully!");
            } else {
                await createTurf(id, formDataToSend, token);
                alert("Turf created successfully!");
            }

            // Reset state
            setForm({});
            setEditingTurfId(null);
            const updatedTurfs = await getTurfsByManager(id, token);
            setTurfs(updatedTurfs);
            setViewType("VIEW_TURFS");
        } catch (err) {
            alert("Failed to submit turf");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSlotId) {
                const updated = await updateSlot(editingSlotId, {
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                }, token);
                setSlots((prev) =>
                    prev.map((s) => (s.slotId === editingSlotId ? updated : s))
                );
                alert("Slot updated successfully!");
            } else {
                const { turfId, startTime, endTime, price } = formData;
                const newSlot = await createSlot(turfId, { startTime, endTime, price }, token);
                setSlots((prev) => [...prev, newSlot]);
                alert("Slot added successfully!");
            }

            // Reset
            setFormData({});
            setEditingSlotId(null);
            setViewType("VIEW_SLOTS");
        } catch (err) {
            alert("Failed to save slot.");
        }
    };

    const fetchReviews = async (turfId) => {
        try {
            const data = await getReviewsByTurfId(turfId);
            setReviews(data);
        } catch (err) {
            alert("Failed to fetch reviews.");
            console.error(err);
        }
    };


    return (
        <div className="space-y-6">
            {viewType === "DASHBOARD" && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Welcome, {manager.name} 👋</h2>
                    <div className="space-y-2 text-gray-700">
                        <p><span className="font-semibold">Email:</span> {manager.email}</p>
                        <p><span className="font-semibold">Phone:</span> {manager.phone}</p>
                        <p><span className="font-semibold">Address:</span> {manager.address}</p>
                    </div>
                </div>

            )}

            {viewType === "UPDATE_PROFILE" && (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <h2 className="text-lg font-bold">Update Profile</h2>
                    <input
                        className="border p-2 w-full"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                        required
                    />
                    <input
                        className="border p-2 w-full"
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone"
                        required
                    />
                    <input
                        className="border p-2 w-full"
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Address"
                        required
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                </form>
            )}

            {viewType === "CHANGE_PASSWORD" && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <h2 className="text-lg font-bold">Change Password</h2>
                    <input
                        className="border p-2 w-full"
                        type="password"
                        placeholder="Old Password"
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, oldPassword: e.target.value })
                        }
                        required
                    />
                    <input
                        className="border p-2 w-full"
                        type="password"
                        placeholder="New Password"
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                    />
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded">Change</button>
                </form>
            )}

            {viewType === "VIEW_TURFS" && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Turfs</h2>
                    <ul className="space-y-2">
                        {turfs.map((turf) => (
                            <li
                                key={turf.turfId}
                                className="border p-4 rounded bg-gray-100 flex justify-between"
                            >
                                <span>
                                    <b>{turf.name}</b> - {turf.location}
                                </span>
                                <div className="space-x-2">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={async () => {
                                            const details = await getTurfById(turf.turfId, token);
                                            setSelectedTurf(details);
                                            setShowTurfModal(true);

                                        }}
                                    >
                                        View
                                    </button>

                                    <button
                                        className="bg-yellow-600 text-white px-2 py-1 rounded"
                                        onClick={() => {
                                            setForm({
                                                name: turf.name,
                                                location: turf.location,
                                                description: turf.description,
                                                pricePerHour: turf.pricePerHour,
                                                image: null,
                                            });
                                            setEditingTurfId(turf.turfId);
                                            setViewType("ADD_TURFS");
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={async () => {
                                            await deleteTurf(turf.turfId, token);
                                            getTurfsByManager(id, token).then(setTurfs);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {viewType === "ADD_TURFS" && (
                <form
                    onSubmit={handleSubmitTurf}
                    className="max-w-md bg-white p-4 shadow rounded space-y-4"
                    encType="multipart/form-data"
                >
                    <h2 className="text-lg font-bold">
                        {editingTurfId ? "Update Turf" : "Add Turf"}
                    </h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name || ""}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={form.location || ""}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Price Per Hour"
                        value={form.pricePerHour || ""}
                        onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="bg-lime-600 text-white px-4 py-2 rounded">
                        {editingTurfId ? "Update Turf" : "Add Turf"}
                    </button>
                </form>
            )}

            {viewType === "VIEW_SLOTS" && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold mb-2">Slots</h2>

                    <select
                        className="border p-2 w-full"
                        onChange={(e) => setFormData({ ...formData, turfId: e.target.value })}
                        value={formData.turfId || ""}
                    >
                        <option value="">Select Turf</option>
                        {turfs.map((turf) => (
                            <option key={turf.turfId} value={turf.turfId}>
                                {turf.name}
                            </option>
                        ))}
                    </select>

                    {formData.turfId && (
                        <table className="w-full border mt-4 bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Start Time</th>
                                    <th className="border px-4 py-2">End Time</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Turf</th>
                                    <th className="border px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slots
                                    .filter((s) => s.turfId === Number(formData.turfId))
                                    .map((slot) => (
                                        <tr key={slot.slotId}>
                                            <td className="border px-4 py-2">{slot.startTime}</td>
                                            <td className="border px-4 py-2">{slot.endTime}</td>
                                            <td className="border px-4 py-2">{slot.status}</td>
                                            <td className="border px-4 py-2">{slot.turfName}</td>
                                            <td className="border px-4 py-2">
                                                <div className="space-x-2">
                                                    <button
                                                        className="bg-yellow-600 text-white px-2 py-1 rounded"
                                                        onClick={() => {
                                                            setEditingSlotId(slot.slotId);
                                                            setFormData({
                                                                turfId: slot.turfId,
                                                                startTime: slot.startTime,
                                                                endTime: slot.endTime,
                                                            });
                                                            setViewType("ADD_SLOTS");
                                                        }}
                                                    >
                                                        Update
                                                    </button>

                                                    <button
                                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                                        onClick={async () => {
                                                            await deleteSlot(slot.slotId, token);
                                                            setSlots((prev) => prev.filter((s) => s.slotId !== slot.slotId));
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    )}
                </div>
            )}


            {viewType === "ADD_SLOTS" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-lg font-bold">{editingSlotId ? "Update Slot" : "Add Slot"}</h2>

                    <select
                        className="border p-2 w-full"
                        value={formData.turfId || ""}
                        onChange={(e) => setFormData({ ...formData, turfId: e.target.value })}
                        required
                    >
                        <option value="">Select Turf</option>
                        {turfs.map((turf) => (
                            <option key={turf.turfId} value={turf.turfId}>
                                {turf.name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="border p-2 w-full"
                        type="time"
                        placeholder="Start Time"
                        value={formData.startTime || ""}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                    />

                    <input
                        className="border p-2 w-full"
                        type="time"
                        placeholder="End Time"
                        value={formData.endTime || ""}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                    />

                    <button className="bg-violet-700 text-white px-4 py-2 rounded">
                        {editingSlotId ? "Update Slot" : "Add Slot"}
                    </button>

                    {editingSlotId && (
                        <button
                            type="button"
                            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                                setEditingSlotId(null);
                                setFormData({});
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </form>

            )}


            {viewType === "VIEW_BOOKINGS" && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Select Turf to View Bookings</h2>
                    <select
                        className="border p-2 w-full mb-4"
                        onChange={(e) =>
                            setFormData({ ...formData, turfId: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Turf</option>
                        {turfs.map((turf) => (
                            <option key={turf.turfId} value={turf.turfId}>
                                {turf.name}
                            </option>
                        ))}
                    </select>

                    {bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">User ID</th>
                                        <th className="border p-2">User Name</th>
                                        <th className="border p-2">Slot Date</th>
                                        <th className="border p-2">Start Time</th>
                                        <th className="border p-2">End Time</th>
                                        <th className="border p-2">Turf Name</th>
                                        <th className="border p-2">Price/Hour</th>
                                        <th className="border p-2">Amount</th>
                                        <th className="border p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b.bookingId} className="text-center">
                                            <td className="border p-2">{b.userId}</td>
                                            <td className="border p-2">{b.userName}</td>
                                            <td className="border p-2">{b.slotDate}</td>
                                            <td className="border p-2">{b.startTime}</td>
                                            <td className="border p-2">{b.endTime}</td>
                                            <td className="border p-2">{b.turfName}</td>
                                            <td className="border p-2">₹{b.pricePerHour}</td>
                                            <td className="border p-2">₹{b.amount}</td>
                                            <td className="border p-2">{b.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        formData.turfId && (
                            <p className="text-gray-500 mt-4">No bookings found for this turf.</p>
                        )
                    )}
                </div>
            )}


            {viewType === "VIEW_REVIEWS" && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Select Turf to View Reviews</h2>

                    <select
                        className="border p-2 w-full mb-4"
                        value={formData.turfId || ""}
                        onChange={(e) => {
                            const turfId = e.target.value;
                            setFormData((prev) => ({ ...prev, turfId }));
                            fetchReviews(turfId); // call fetch
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
                        formData.turfId && <p className="text-sm text-gray-500">No reviews available for this turf.</p>
                    )}
                </div>
            )}


            {showTurfModal && selectedTurf && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Turf Details</h2>
                        <ul className="text-sm space-y-2">
                            <li><strong>Name:</strong> {selectedTurf.name}</li>
                            <li><strong>Location:</strong> {selectedTurf.location}</li>
                            <li><strong>Description:</strong> {selectedTurf.description}</li>
                            <li><strong>Price Per Hour:</strong> ₹{selectedTurf.pricePerHour}</li>
                            {selectedTurf.imagePath && (
                                <li>
                                    <strong>Image:</strong>
                                    <img
                                        src={`http://localhost:8080/${selectedTurf.imagePath}`}
                                        alt="Turf"
                                        className="mt-2 w-full max-h-48 object-cover rounded"
                                    />
                                </li>
                            )}
                        </ul>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => setShowTurfModal(false)}
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

export default ManagerDashboard;
