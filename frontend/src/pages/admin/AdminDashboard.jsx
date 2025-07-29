import { useState } from "react";
import {
    getAllUsers,
    getAllManagers,
    deleteManagerById,
    getUserById,
    getManagerById,
    registerManager,
} from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [viewType, setViewType] = useState("");
    const [selected, setSelected] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newManager, setNewManager] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    const fetchUsers = async () => {
        const data = await getAllUsers(token);
        setUsers(data);
        setViewType("USERS");
        setSelected(null);
        setShowAddForm(false);
    };

    const fetchManagers = async () => {
        const data = await getAllManagers(token);
        setManagers(data);
        setViewType("MANAGERS");
        setSelected(null);
        setShowAddForm(false);
    };

    const viewDetails = async (id, type) => {
        const data =
            type === "USER"
                ? await getUserById(id, token)
                : await getManagerById(id, token);
        setSelected(data);
        setShowAddForm(false);
    };

    const handleDelete = async (id) => {
        await deleteManagerById(id, token);
        fetchManagers();
    };

    const handleAddManagerSubmit = async (e) => {
        e.preventDefault();
        await registerManager(newManager, token);
        fetchManagers();
        setShowAddForm(false);
        setNewManager({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 space-y-4">
                <button
                    onClick={fetchUsers}
                    className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                >
                    Get Users
                </button>
                <button
                    onClick={fetchManagers}
                    className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                    Get Managers
                </button>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                        setSelected(null);
                        setViewType("");
                    }}
                    className="w-full bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
                >
                    Add Manager
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 p-4 overflow-x-auto">
                {showAddForm && (
                    <form
                        onSubmit={handleAddManagerSubmit}
                        className="max-w-md space-y-4 bg-gray-100 p-4 rounded shadow"
                    >
                        <h2 className="text-lg font-bold">Add New Manager</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 border"
                            value={newManager.name}
                            onChange={(e) =>
                                setNewManager({ ...newManager, name: e.target.value })
                            }
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border"
                            value={newManager.email}
                            onChange={(e) =>
                                setNewManager({ ...newManager, email: e.target.value })
                            }
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border"
                            value={newManager.password}
                            onChange={(e) =>
                                setNewManager({ ...newManager, password: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full p-2 border"
                            value={newManager.phone}
                            onChange={(e) =>
                                setNewManager({ ...newManager, phone: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            className="w-full p-2 border"
                            value={newManager.address}
                            onChange={(e) =>
                                setNewManager({ ...newManager, address: e.target.value })
                            }
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Create Manager
                        </button>
                    </form>
                )}

                {viewType === "USERS" && (
                    <table className="min-w-full table-auto border border-gray-300 mt-4">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userid} className="border-t">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.phone}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => viewDetails(user.userid, "USER")}
                                            className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {viewType === "MANAGERS" && (
                    <table className="min-w-full table-auto border border-gray-300 mt-4">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managers.map((manager) => (
                                <tr key={manager.managerId} className="border-t">
                                    <td className="px-4 py-2">{manager.name}</td>
                                    <td className="px-4 py-2">{manager.email}</td>
                                    <td className="px-4 py-2">{manager.phone}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => viewDetails(manager.managerId, "MANAGER")}
                                            className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(manager.managerId)}
                                            className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
        </div>
    );
};

export default AdminDashboard;
