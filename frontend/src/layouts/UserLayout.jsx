import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">User Panel</h2>
                <nav className="space-y-2">
                    <Link to="/user/dashboard">Dashboard</Link>
                    <button onClick={handleLogout} className="block text-red-500 mt-4">
                        Logout
                    </button>
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
