import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


const ManagerLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("DASHBOARD");


    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
                <h2 className="text-xl font-bold mb-4">Manager Panel</h2>
                <button
                    onClick={() => setViewType("DASHBOARD")}
                    className="w-full bg-blue-500 px-4 py-2 rounded"
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setViewType("UPDATE_PROFILE")}
                    className="w-full bg-green-500 px-4 py-2 rounded"
                >
                    Update Profile
                </button>
                <button
                    onClick={() => setViewType("CHANGE_PASSWORD")}
                    className="w-full bg-yellow-500 px-4 py-2 rounded"
                >
                    Change Password
                </button>
                <button
                    onClick={() => setViewType("VIEW_TURFS")}
                    className="w-full bg-pink-600 px-4 py-2 rounded"
                >
                    View Turfs
                </button>
                <button
                    onClick={() => setViewType("VIEW_SLOTS")}
                    className="w-full bg-orange-500 px-4 py-2 rounded"
                >
                    View Slots
                </button>
                <button
                    onClick={() => setViewType("VIEW_BOOKINGS")}
                    className="w-full bg-red-500 px-4 py-2 rounded"
                >
                    View Bookings
                </button>
                <button
                    onClick={() => setViewType("VIEW_REVIEWS")}
                    className="w-full bg-fuchsia-500 px-4 py-2 rounded"
                >
                    View Reviews
                </button>
                <button
                    onClick={() => setViewType("ADD_SLOTS")}
                    className="w-full bg-violet-700 px-4 py-2 rounded"
                >
                    Add Slots
                </button>
                <button
                    onClick={() => setViewType("ADD_TURFS")}
                    className="w-full bg-lime-400 px-4 py-2 rounded"
                >
                    Add Turfs
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full text-red-400 mt-4 px-4 py-2 border border-red-400 rounded"
                >
                    Logout
                </button>
            </aside>
            <main className="flex-1 p-6">
                <Outlet context={{ viewType, setViewType }} />
            </main>
        </div>
    );
};

export default ManagerLayout;

