import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { updateManagerById, changePassword } from "../api/managerApi";

const ManagerLayout = () => {
    const { logout, id } = useAuth();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
    });
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(passwordForm, token);
            alert("Password updated successfully!");
            setShowChangePasswordForm(false);
            setPasswordForm({ email: "", oldPassword: "", newPassword: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to update password.");
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateManagerById(id, formData, token);
            alert("Manager updated successfully!");
            setShowUpdateForm(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update manager.");
        }
    };

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-100 p-4">
                <h2 className="text-xl font-bold mb-4">Manager Panel</h2>
                <nav className="space-y-2">
                    <Link to="/manager/dashboard">Dashboard</Link>
                    <button
                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                        className="block text-blue-500 mt-4"
                    >
                        {showUpdateForm ? "Cancel Update" : "Update Manager"}
                    </button>
                    <button
                        onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                        className="block text-blue-500 mt-4"
                    >
                        {showChangePasswordForm ? "Cancel Password Change" : "Change Password"}
                    </button>

                    <button onClick={handleLogout} className="block text-red-500 mt-4">
                        Logout
                    </button>
                </nav>

                {showUpdateForm && (
                    <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                        >
                            Submit
                        </button>
                    </form>
                )}

                {showChangePasswordForm && (
                    <form onSubmit={handleChangePasswordSubmit} className="mt-4 space-y-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={passwordForm.email}
                            onChange={handlePasswordChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <input
                            type="password"
                            name="oldPassword"
                            placeholder="Old Password"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </aside>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default ManagerLayout;
