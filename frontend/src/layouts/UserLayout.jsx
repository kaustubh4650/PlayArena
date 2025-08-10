import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const UserLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [viewType, setViewType] = useState("DASHBOARD");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        // <div className="min-h-screen flex">
        //     <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        //         <h2 className="text-xl font-bold mb-4">User Panel</h2>
        //         <button
        //             onClick={() => setViewType("DASHBOARD")}
        //             className="w-full bg-blue-500 px-4 py-2 rounded"
        //         >
        //             Dashboard
        //         </button>
        //         <button
        //             onClick={() => setViewType("UPDATE_PROFILE")}
        //             className="w-full bg-green-500 px-4 py-2 rounded"
        //         >
        //             Update Profile
        //         </button>
        //         <button
        //             onClick={() => setViewType("CHANGE_PASSWORD")}
        //             className="w-full bg-yellow-500 px-4 py-2 rounded"
        //         >
        //             Change Password
        //         </button>
        //         <button
        //             onClick={() => setViewType("MY_BOOKINGS")}
        //             className="w-full bg-pink-600 px-4 py-2 rounded"
        //         >
        //             My Bookings
        //         </button>
        //         <button
        //             onClick={() => setViewType("ALL_REVIEWS")}
        //             className="w-full bg-indigo-500 px-4 py-2 rounded"
        //         >
        //             All Reviews
        //         </button>
        //         <button
        //             onClick={handleLogout}
        //             className="w-full text-red-400 mt-4 px-4 py-2 border border-red-400 rounded"
        //         >
        //             Logout
        //         </button>
        //     </aside>
        //     <main className="flex-1 p-6">
        //         <Outlet context={{ viewType, setViewType }} />
        //     </main>
        // </div>


        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="px-6 py-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold tracking-wide">User Panel</h2>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => setViewType("DASHBOARD")}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        📊 <span className="ml-3 text-lg">Dashboard</span>
                    </button>

                    <button
                        onClick={() => setViewType("UPDATE_PROFILE")}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        ✏️ <span className="ml-3 text-lg">Update Profile</span>
                    </button>

                    <button
                        onClick={() => setViewType("CHANGE_PASSWORD")}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        🔑 <span className="ml-3 text-lg">Change Password</span>
                    </button>

                    <button
                        onClick={() => setViewType("MY_BOOKINGS")}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        📅 <span className="ml-3 text-lg">My Bookings</span>
                    </button>

                    <button
                        onClick={() => setViewType("ALL_REVIEWS")}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition"
                    >
                        ⭐ <span className="ml-3 text-lg">All Reviews</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg text-red-400 border border-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                        🚪 <span className="ml-3 text-lg">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet context={{ viewType, setViewType }} />
            </main>
        </div>

    );
};

export default UserLayout;
