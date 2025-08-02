import React, { useEffect, useState } from "react";
import {
    getManagerById,
    getTurfById,
    updateTurf,
    createTurf,
    getTurfsByManager,
    deleteTurf,
    getBookingsByTurfId,
    createSlot,
    getSlotsByTurfId,
    getSlotById,
    updateSlot,
    deleteSlot,
} from "../../api/managerApi";

const ManagerDashboard = () => {
    const [view, setView] = useState("TURFS");
    const [manager, setManager] = useState(null);
    const [turfs, setTurfs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState(null);
    const [viewedTurf, setViewedTurf] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ email: "", oldPassword: "", newPassword: "" });

    const token = localStorage.getItem("token");
    const managerId = localStorage.getItem("id");
    const managerName = localStorage.getItem("name");

    useEffect(() => {
        fetchManager();
        fetchTurfs();
    }, []);

    const fetchManager = async () => {
        const res = await getManagerById(managerId, token);
        setManager(res);
    };

    const fetchTurfs = async () => {
        const res = await getTurfsByManager(managerId, token);
        setTurfs(res);
    };

    const fetchTurfDetails = async (turfId) => {
        if (viewedTurf && viewedTurf.turfId === turfId) {
            setViewedTurf(null);
        } else {
            const res = await getTurfById(turfId, token);
            setViewedTurf(res);
        }
    };

    const fetchBookings = async (turfId) => {
        const res = await getBookingsByTurfId(turfId, token);
        setBookings(res);
        setView("BOOKINGS");
    };

    const fetchSlots = async (turfId) => {
        const res = await getSlotsByTurfId(turfId, token);
        setSlots(res);
        setSelectedId(turfId);
        setView("SLOTS");
    };

    const handleDeleteTurf = async (id) => {
        await deleteTurf(id, token);
        fetchTurfs();
    };

    const handleDeleteSlot = async (id) => {
        await deleteSlot(id, token);
        fetchSlots(selectedId);
    };

    const handleEditTurf = async (id) => {
        setSelectedId(id);
        const res = await getTurfById(id, token);
        setForm(res);
        setFormType("TURF");
        setShowForm(true);
    };

    const handleEditSlot = async (id) => {
        const res = await getSlotById(id, token);
        setForm(res);
        setFormType("SLOT");
        setShowForm(true);
    };

    const handleTurfSubmit = async () => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("location", form.location);
        formData.append("description", form.description);
        formData.append("pricePerHour", form.pricePerHour);
        if (form.image) formData.append("image", form.image);

        if (form.turfId) {
            await updateTurf(form.turfId, formData, token);
        } else {
            await createTurf(managerId, formData, token);
        }
        fetchTurfs();
    };

    const handleSlotSubmit = async () => {
        if (form.slotId) {
            await updateSlot(form.slotId, form, token);
        } else {
            const turfId = form.turfId || selectedId;
            if (!turfId) return alert("No turf selected");
            await createSlot(turfId, form, token);
        }
        fetchSlots(form.turfId || selectedId);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        formType === "TURF" ? await handleTurfSubmit() : await handleSlotSubmit();
        setShowForm(false);
        setForm({});
        setFormType(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateManagerById(id, formData, token);
            alert("Manager updated successfully!");
            setShowUpdateForm(false);
        } catch {
            alert("Failed to update manager.");
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordForm, token);
            alert("Password updated successfully!");
            setShowChangePasswordForm(false);
            setPasswordForm({ email: "", oldPassword: "", newPassword: "" });
        } catch {
            alert("Failed to update password.");
        }
    };


    const renderTable = () => {
        const tableClass = "w-full border border-gray-300 text-sm";
        const thClass = "bg-gray-200 p-2 border";
        const tdClass = "p-2 border text-center";
        const actionBtn = "text-blue-600 hover:underline mx-1";

        if (view === "TURFS")
            return (
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th className={thClass}>Name</th>
                            <th className={thClass}>Location</th>
                            <th className={thClass}>Price</th>
                            <th className={thClass}>Description</th>
                            <th className={thClass}>Status</th>
                            <th className={thClass}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turfs.map((t) => (
                            <tr key={t.turfId} className="hover:bg-gray-100">
                                <td className={tdClass}>{t.name}</td>
                                <td className={tdClass}>{t.location}</td>
                                <td className={tdClass}>{t.pricePerHour}</td>
                                <td className={tdClass}>{t.description}</td>
                                <td className={tdClass}>{t.status}</td>
                                <td className={tdClass}>
                                    <button onClick={() => fetchBookings(t.turfId)} className={actionBtn}>Bookings</button>
                                    <button onClick={() => fetchSlots(t.turfId)} className={actionBtn}>Slots</button>
                                    <button onClick={() => fetchTurfDetails(t.turfId)} className={actionBtn}>View</button>
                                    <button onClick={() => handleEditTurf(t.turfId)} className={actionBtn}>Edit</button>
                                    <button onClick={() => handleDeleteTurf(t.turfId)} className="text-red-600 hover:underline mx-1">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );

        if (view === "BOOKINGS")
            return (
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th className={thClass}>User ID</th>
                            <th className={thClass}>User Name</th>
                            <th className={thClass}>Slot Date</th>
                            <th className={thClass}>Start</th>
                            <th className={thClass}>End</th>
                            <th className={thClass}>Turf Name</th>
                            <th className={thClass}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.bookingId} className="hover:bg-gray-100">
                                <td className={tdClass}>{b.userId}</td>
                                <td className={tdClass}>{b.userName}</td>
                                <td className={tdClass}>{b.slotDate}</td>
                                <td className={tdClass}>{b.startTime}</td>
                                <td className={tdClass}>{b.endTime}</td>
                                <td className={tdClass}>{b.turfName}</td>
                                <td className={tdClass}>{b.pricePerHour}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        if (view === "SLOTS")
            return (
                <table className={tableClass}>
                    <thead>
                        <tr>
                            <th className={thClass}>Slot ID</th>
                            <th className={thClass}>Turf Name</th>
                            <th className={thClass}>Start</th>
                            <th className={thClass}>End</th>
                            <th className={thClass}>Status</th>
                            <th className={thClass}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((s) => (
                            <tr key={s.slotId} className="hover:bg-gray-100">
                                <td className={tdClass}>{s.slotId}</td>
                                <td className={tdClass}>{s.turfName}</td>
                                <td className={tdClass}>{s.startTime}</td>
                                <td className={tdClass}>{s.endTime}</td>
                                <td className={tdClass}>{s.status}</td>
                                <td className={tdClass}>
                                    <button onClick={() => handleEditSlot(s.slotId)} className={actionBtn}>Edit</button>
                                    <button onClick={() => handleDeleteSlot(s.slotId)} className="text-red-600 hover:underline mx-1">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
    };
    return (
        <div className="flex h-screen">
            <aside className="w-1/4 bg-gray-100 p-4 border-r">
                <h2 className="text-xl font-bold mb-6">Welcome, {managerName}</h2>
                <nav className="space-y-3">
                    <button onClick={() => setView("TURFS")} className="block w-full text-left text-blue-700 hover:underline">View Turfs</button>
                    <button onClick={() => setView("BOOKINGS")} className="block w-full text-left text-blue-700 hover:underline">View Bookings</button>
                    <button onClick={() => setView("SLOTS")} className="block w-full text-left text-blue-700 hover:underline">View Slots</button>
                    <button onClick={() => { setShowForm(true); setFormType("TURF"); setForm({}); }} className="block w-full text-left text-green-700 hover:underline">Add Turf</button>
                    <button onClick={() => { setShowForm(true); setFormType("SLOT"); setForm({ turfId: selectedId || null }); }} className="block w-full text-left text-green-700 hover:underline">Add Slot</button>
                    <button onClick={() => setShowUpdateForm(!showUpdateForm)} className="text-blue-600 hover:underline text-left">
                        {showUpdateForm ? "Cancel Update" : "Update Manager"}
                    </button>
                    <button onClick={() => setShowChangePasswordForm(!showChangePasswordForm)} className="text-blue-600 hover:underline text-left">
                        {showChangePasswordForm ? "Cancel Password Change" : "Change Password"}
                    </button>
                </nav>
            </aside>

            <main className="w-3/4 p-6 overflow-y-auto">
                {renderTable()}

                {showForm && (
                    <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                        {formType === "TURF" && (
                            <>
                                <input type="text" placeholder="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border p-2 rounded" />
                                <input type="text" placeholder="Location" value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} required className="w-full border p-2 rounded" />
                                <input type="text" placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border p-2 rounded" />
                                <input type="number" placeholder="Price Per Hour" value={form.pricePerHour || ""} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} className="w-full border p-2 rounded" />
                                <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="w-full border p-2 rounded" />
                            </>
                        )}
                        {formType === "SLOT" && (
                            <>
                                <input type="time" value={form.startTime || ""} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required className="w-full border p-2 rounded" />
                                <input type="time" value={form.endTime || ""} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required className="w-full border p-2 rounded" />
                            </>
                        )}
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
                    </form>
                )}

                {viewedTurf && (
                    <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
                        <h3 className="text-lg font-bold mb-2">Turf Details</h3>
                        <p><strong>ID:</strong> {viewedTurf.turfId}</p>
                        <p><strong>Name:</strong> {viewedTurf.name}</p>
                        <p><strong>Location:</strong> {viewedTurf.location}</p>
                        <p><strong>Price/Hour:</strong> ₹{viewedTurf.pricePerHour}</p>
                        <p><strong>Description:</strong> {viewedTurf.description}</p>
                        <p><strong>Status:</strong> {viewedTurf.status}</p>
                        <p><strong>Manager ID:</strong> {viewedTurf.managerId}</p>
                        <p><strong>Manager Name:</strong> {viewedTurf.managerName}</p>
                        {viewedTurf.imagePath && (
                            <img src={`http://localhost:8080/${viewedTurf.imagePath}`} alt="Turf" height={200} width={200} className="mt-2 w-64 rounded" />
                        )}
                    </div>
                )}

                {showUpdateForm && (
                    <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-3">
                        {["name", "address", "phone"].map((field) => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                className="w-full border px-3 py-2 rounded"
                            />
                        ))}
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
                            Submit
                        </button>
                    </form>
                )}

                {showChangePasswordForm && (
                    <form onSubmit={handleChangePasswordSubmit} className="mt-4 space-y-3">
                        {["email", "oldPassword", "newPassword"].map((field) => (
                            <input
                                key={field}
                                type={field.includes("Password") ? "password" : "email"}
                                name={field}
                                placeholder={field.replace(/([A-Z])/g, " $1")}
                                value={passwordForm[field]}
                                onChange={handlePasswordChange}
                                required
                                className="w-full border px-3 py-2 rounded"
                            />
                        ))}
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
                            Submit
                        </button>
                    </form>
                )}

            </main>
        </div>
    );
};

export default ManagerDashboard;

