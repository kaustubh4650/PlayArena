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
import { ToastContainer, toast } from "react-toastify";

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
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (id && token) {
            getManagerById(id, token).then(data => {
                setManager(data);
                setFormData(data);
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
                setSlots(data);
            } else {
                setSlots([]);
            }
        };

        fetchSlots();
    }, [formData.turfId, token]);

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

        if (!passwordData.oldPassword.trim()) {
            newErrors.oldPassword = "Old password is required";
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(passwordData.newPassword)) {
            newErrors.newPassword = "Password must be at least 6 characters and contain both letters and numbers";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSlotForm = () => {
        let newErrors = {};

        if (!formData.turfId) newErrors.turfId = "Please select a turf";
        if (!formData.startTime) newErrors.startTime = "Please enter start time";
        if (!formData.endTime) newErrors.endTime = "Please enter end time";
        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
            newErrors.endTime = "End time must be after start time";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const validateTurfForm = (form, editingTurfId) => {
        const errors = {};

        if (!/^[A-Za-z\s]{2,}$/.test(form.name)) {
            errors.name = "Name must be at least 2 letters and contain only letters";
        }
        if (!/^[A-Za-z\s]{2,}$/.test(form.location)) {
            errors.location = "Location must be at least 2 letters and contain only letters";
        }
        if (!/^[A-Za-z\s]{4,}$/.test(form.description)) {
            errors.description = "Description must be at least 4 letters";
        }
        if (!form.pricePerHour || form.pricePerHour <= 0) errors.pricePerHour = "Enter a valid price per hour";
        if (!form.category) errors.category = "Select a category";

        if (!editingTurfId && !form.image) {
            errors.image = "Image is required for new turfs";
        } else if (form.image) {
            if (form.image.size > 2 * 1024 * 1024) {
                errors.image = "Image must be less than 2MB";
            }
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
            if (!allowedTypes.includes(form.image.type)) {
                errors.image = "Only JPG, PNG, and WEBP images are allowed";
            }
        }

        return errors;
    };



    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validateProfileForm()) return;
        await updateManagerById(id, formData, token);
        toast.success("Profile updated successfully!", {
            position: "top-center",
            autoClose: 2000,
        });
        setErrors({});
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        try {
            await changePassword(passwordData, token);
            setPasswordData({ oldPassword: "", newPassword: "" });
            setErrors({});
            toast.success("Password changed successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("Failed to change password. Please try again.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };


    const handleSubmitTurf = async (e) => {
        e.preventDefault();

        const validationErrors = validateTurfForm(form, editingTurfId);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", form.name);
        formDataToSend.append("location", form.location);
        formDataToSend.append("description", form.description);
        formDataToSend.append("pricePerHour", form.pricePerHour);
        formDataToSend.append("category", form.category);
        if (form.image) formDataToSend.append("image", form.image);

        try {
            if (editingTurfId) {
                await updateTurf(editingTurfId, formDataToSend, token);
                toast.success("Turf updated successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                await createTurf(id, formDataToSend, token);
                toast.success("Turf created successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }

            setForm({});
            setEditingTurfId(null);
            const updatedTurfs = await getTurfsByManager(id, token);
            setTurfs(updatedTurfs);
            setViewType("VIEW_TURFS");
        } catch (err) {
            toast.error("Failed to submit turf", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateSlotForm()) return;

        try {
            if (editingSlotId) {
                const updated = await updateSlot(editingSlotId, {
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                }, token);
                setSlots((prev) =>
                    prev.map((s) => (s.slotId === editingSlotId ? updated : s))
                );
                toast.success("Slot updated successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                const { turfId, startTime, endTime, price } = formData;
                const newSlot = await createSlot(turfId, { startTime, endTime, price }, token);
                setSlots((prev) => [...prev, newSlot]);
                toast.success("Slot added successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            }

            // Reset
            setFormData({});
            setEditingSlotId(null);
            setViewType("VIEW_SLOTS");
        } catch (err) {
            toast.error("Failed to save slot.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const fetchReviews = async (turfId) => {
        try {
            const data = await getReviewsByTurfId(turfId);
            setReviews(data);
        } catch (err) {
            toast.error("Failed to fetch reviews.", {
                position: "top-center",
                autoClose: 2000,
            });

        }
    };


    return (
        <div className="space-y-6">

            <ToastContainer />

            {viewType === "DASHBOARD" && (

                <div className="flex justify-center bg-gray-100">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Welcome, {manager.name} !
                        </h2>

                        <div className="space-y-4 text-gray-700">
                            <p className="flex justify-between border-b pb-2">
                                <strong>Email:</strong> <span>{manager.email}</span>
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <strong>Phone:</strong> <span>{manager.phone}</span>
                            </p>
                            <p className="flex justify-between">
                                <strong>Address:</strong> <span>{manager.address}</span>
                            </p>
                        </div>
                    </div>
                </div>


            )}

            {viewType === "UPDATE_PROFILE" && (

                <div className="flex justify-center bg-gray-100 p-4">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            Update Profile
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ""}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your full name"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address || ""}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your address"
                                    required
                                />
                                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone || ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your phone number"
                                    maxLength={10}
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium 
                           shadow hover:bg-blue-700 transition-colors duration-200"
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

                        <form onSubmit={handleChangePassword} className="space-y-5">
                            {/* Old Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Old Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword || ""}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                    }
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your old password"
                                    required
                                />
                                {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword || ""}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                    }
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your new password"
                                    required
                                />
                                {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors duration-200"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>

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
                                                category: turf.category,
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
                                            toast.success("Turf Removed !", {
                                                position: "top-center",
                                                autoClose: 2000,
                                            });
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
                    className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4"
                    encType="multipart/form-data"
                >
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                        {editingTurfId ? "Update Turf" : "Add Turf"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name || ""}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <input
                        type="text"
                        placeholder="Location"
                        value={form.location || ""}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

                    <input
                        type="text"
                        placeholder="Description"
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                    <input
                        type="number"
                        placeholder="Price Per Hour"
                        value={form.pricePerHour || ""}
                        onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.pricePerHour && <p className="text-red-500 text-sm">{errors.pricePerHour}</p>}

                    <select
                        value={form.category || ""}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Select Category</option>
                        <option value="HOCKEY">Hockey</option>
                        <option value="CRICKET">Cricket</option>
                        <option value="FOOTBALL">Football</option>
                        <option value="BASKETBALL">Basketball</option>
                        <option value="BADMINTON">Badminton</option>
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}


                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            {editingTurfId ? "Update Turf" : "Add Turf"}
                        </button>
                    </div>
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

                        <div className="overflow-x-auto rounded-lg shadow mt-4">
                            <table className="w-full border-collapse border border-gray-300 text-md">
                                <thead className="bg-gray-300 text-black uppercase text-sm rounded-t-lg">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Start Time</th>
                                        <th className="px-6 py-3 text-left">End Time</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Turf</th>
                                        <th className="px-6 py-3 text-left">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {slots
                                        .filter((s) => s.turfId === Number(formData.turfId))
                                        .map((slot) => (
                                            <tr key={slot.slotId} className="hover:bg-gray-200 transition-colors">
                                                <td className="px-6 py-3">{slot.startTime}</td>
                                                <td className="px-6 py-3">{slot.endTime}</td>
                                                <td className="px-6 py-3">{slot.status}</td>
                                                <td className="px-6 py-3">{slot.turfName}</td>
                                                <td className="px-6 py-3 space-x-2">
                                                    <button
                                                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
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
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                        onClick={async () => {
                                                            await deleteSlot(slot.slotId, token);
                                                            toast.success("Slot Removed !", {
                                                                position: "top-center",
                                                                autoClose: 2000,
                                                            });
                                                            setSlots((prev) => prev.filter((s) => s.slotId !== slot.slotId));

                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                    )}
                </div>
            )}


            {viewType === "ADD_SLOTS" && (

                <div className="flex justify-center bg-gray-100 p-4">
                    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            {editingSlotId ? "Update Slot" : "Add Slot"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Turf Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Select Turf</label>
                                <select
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                {errors.turfId && <p className="text-red-500 text-sm">{errors.turfId}</p>}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.startTime || ""}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                                {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
                                <input
                                    type="time"
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={formData.endTime || ""}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    required
                                />
                                {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 transition-colors duration-200"
                                >
                                    {editingSlotId ? "Update Slot" : "Add Slot"}
                                </button>

                                {editingSlotId && (
                                    <button
                                        type="button"
                                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-medium shadow hover:bg-gray-600 transition-colors duration-200"
                                        onClick={() => {
                                            setEditingSlotId(null);
                                            setFormData({});
                                            setErrors({});
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

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

                        <div className="overflow-x-auto rounded-lg shadow mt-4">
                            <table className="w-full border-collapse border border-gray-300 text-md">
                                <thead className="bg-gray-300 text-black uppercase text-sm rounded-t-lg">
                                    <tr>
                                        <th className="px-6 py-3 text-left">User ID</th>
                                        <th className="px-6 py-3 text-left">User Name</th>
                                        <th className="px-6 py-3 text-left">Slot Date</th>
                                        <th className="px-6 py-3 text-left">Start Time</th>
                                        <th className="px-6 py-3 text-left">End Time</th>
                                        <th className="px-6 py-3 text-left">Turf Name</th>
                                        <th className="px-6 py-3 text-left">Amount</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {bookings.map((b) => (
                                        <tr key={b.bookingId} className="hover:bg-gray-200 transition-colors">
                                            <td className="px-6 py-3">{b.userId}</td>
                                            <td className="px-6 py-3">{b.userName}</td>
                                            <td className="px-6 py-3">{b.slotDate}</td>
                                            <td className="px-6 py-3">{b.startTime}</td>
                                            <td className="px-6 py-3">{b.endTime}</td>
                                            <td className="px-6 py-3">{b.turfName}</td>
                                            <td className="px-6 py-3 font-semibold">₹{b.amount}</td>
                                            <td className="px-6 py-3">{b.status}</td>
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

                        <div className="overflow-x-auto rounded-lg shadow mt-4">
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
                                            <td className="px-6 py-3 font-semibold text-yellow-600">{review.rating} ★</td>
                                            <td className="px-6 py-3">{review.comment}</td>
                                            <td className="px-6 py-3">{review.reviewedOn.slice(0, 10)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
                            <li><strong>Category:</strong> {selectedTurf.category.toLowerCase()}</li>
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
