import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <button
                    onClick={() => setViewType("USERS")}
                    className="w-full bg-blue-500 px-4 py-2 rounded"
                >
                    Get Users
                </button>
                <button
                    onClick={() => setViewType("MANAGERS")}
                    className="w-full bg-green-500 px-4 py-2 rounded"
                >
                    Get Managers
                </button>
                <button
                    onClick={() => setViewType("REVIEWS")}
                    className="w-full bg-orange-500 px-4 py-2 rounded"
                >
                    Get Reviews
                </button>
                <button
                    onClick={() => setViewType("BOOKINGS")}
                    className="w-full bg-yellow-500 px-4 py-2 rounded"
                >
                    Get Bookings
                </button>
                <button
                    onClick={() => setViewType("ADD_MANAGER")}
                    className="w-full bg-purple-500 px-4 py-2 rounded"
                >
                    Add Manager
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full text-red-500 mt-4 px-4 py-2 border border-red-500 rounded"
                >
                    Logout
                </button>
            </aside>
            <main className="flex-1 p-6">
                <Outlet context={{ viewType }} />
            </main>
        </div>
    );
};

export default AdminLayout;
