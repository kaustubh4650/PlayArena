import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManagerLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-100 p-5 border-r space-y-4">
                <h2 className="text-xl font-bold mb-6">Manager Panel</h2>
                <nav className="flex flex-col space-y-2">
                    <Link to="/manager/dashboard" className="text-blue-600 hover:underline">
                        Dashboard
                    </Link>

                    <button onClick={handleLogout} className="text-red-600 hover:underline text-left">
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 bg-white">
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;

