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
    const [formType, setFormType] = useState(null); // NEW
    const [viewedTurf, setViewedTurf] = useState(null);

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

    const handleEdit = async (type, id) => {
        if (type === "turf") {
            await handleEditTurf(id);
        } else if (type === "slot") {
            await handleEditSlot(id);
        }
    };

    const handleTurfSubmit = async () => {

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("location", form.location);
        formData.append("description", form.description);
        formData.append("pricePerHour", form.pricePerHour);
        if (form.image) {
            formData.append("image", form.image);
        }

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
            if (!turfId) {
                alert("No turf selected");
                return;
            }
            await createSlot(turfId, form, token);
        }
        fetchSlots(form.turfId || selectedId);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formType === "TURF") {
            await handleTurfSubmit();
        } else if (formType === "SLOT") {
            await handleSlotSubmit();
        }
        setShowForm(false);
        setForm({});
        setFormType(null);
    };


    const renderTable = () => {
        if (view === "TURFS")
            return (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Name</th><th>Location</th><th>price per hour</th><th>description</th><th>status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turfs.map((t) => (
                            <tr key={t.turfId}>
                                <td>{t.name}</td>
                                <td>{t.location}</td>
                                <td>{t.pricePerHour}</td>
                                <td>{t.description}</td>
                                <td>{t.status}</td>
                                <td>
                                    <button onClick={() => fetchBookings(t.turfId)}>Bookings</button>
                                    <button onClick={() => fetchSlots(t.turfId)}>Slots</button>
                                    <button onClick={() => fetchTurfDetails(t.turfId)}>View</button>
                                    <button onClick={() => handleEdit("turf", t.turfId)}>Edit</button>
                                    <button onClick={() => handleDeleteTurf(t.turfId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        if (view === "BOOKINGS")
            return (
                <table className="w-full">
                    <thead><tr><th>User Id</th><th>User Name</th>
                        <th>Slot Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Turf Name</th>
                        <th>Price Per Hour</th>
                    </tr></thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.bookingId}>
                                <td>{b.userId}</td>
                                <td>{b.userName}</td>
                                <td>{b.slotDate}</td>
                                <td>{b.startTime}</td>
                                <td>{b.endTime}</td>
                                <td>{b.turfName}</td>
                                <td>{b.pricePerHour}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        if (view === "SLOTS")
            return (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Slot Id</th>
                            <th>Turf Name</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slots.map((s) => (
                            <tr key={s.slotId}>
                                <td>{s.slotId}</td>
                                <td>{s.turfName}</td>
                                <td>{s.startTime}</td>
                                <td>{s.endTime}</td>
                                <td>{s.status}</td>
                                <td>
                                    <button onClick={() => handleEdit("slot", s.slotId)}>Edit</button>
                                    <button onClick={() => handleDeleteSlot(s.slotId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
    };

    return (
        <div className="flex h-screen">
            <aside className="w-1/4 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Welcome, {managerName}</h2>
                <nav className="space-y-2">
                    <button onClick={() => setView("TURFS")}>View Turfs</button>
                    <button onClick={() => setView("BOOKINGS")}>View Bookings</button>
                    <button onClick={() => setView("SLOTS")}>View Slots</button>
                    <button onClick={() => { setShowForm(true); setFormType("TURF"); setForm({}); }}>Add Turf</button>
                    <button onClick={() => { setShowForm(true); setFormType("SLOT"); setForm({ turfId: selectedId || null }); }}>Add Slot</button>
                </nav>
            </aside>
            <main className="w-3/4 p-6">
                {renderTable()}
                {showForm && (
                    <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                        {formType === "TURF" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={form.name || ""}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={form.location || ""}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={form.description || ""}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Price Per Hour"
                                    value={form.pricePerHour || ""}
                                    onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                                />
                            </>
                        )}
                        {formType === "SLOT" && (
                            <>
                                <input
                                    type="time"
                                    value={form.startTime || ""}
                                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                    required
                                />
                                <input
                                    type="time"
                                    value={form.endTime || ""}
                                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                    required
                                />
                            </>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                )}
            </main>

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
                        <img
                            src={`http://localhost:8080/${viewedTurf.imagePath}`}
                            alt="Turf"
                            height={200}
                            width={200}
                            className="mt-2 w-64 rounded"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
