import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService"; // adjust path if needed

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",

    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await authService.register(formData);
            if (response.status === 200 || response.status === 201) {
                navigate("/"); // redirect to login
            }
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">address</label>
                    <input
                        type="text"
                        name="address"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">phone</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;