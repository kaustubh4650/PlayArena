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
} from "../../api/adminApi";

const AdminDashboard = () => {
    const { token } = useAuth();
    const { viewType } = useOutletContext();

    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selected, setSelected] = useState(null);
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
        }
    }, [viewType, token]);

    const viewDetails = async (id, type) => {
        const data =
            type === "USER" ? await getUserById(id, token) : await getManagerById(id, token);
        setSelected(data);
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
                                            className="bg-blue-400 text-white px-2 py-1 rounded"
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

            {selected && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">Details</h2>
                    <p><strong>Name:</strong> {selected.name}</p>
                    <p><strong>Email:</strong> {selected.email}</p>
                    <p><strong>Phone:</strong> {selected.phone}</p>
                    <p><strong>Address:</strong> {selected.address}</p>
                    <p><strong>Role:</strong> {selected.role}</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

