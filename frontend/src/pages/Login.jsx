import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });

            toast.success("Login Successful !", {
                position: "top-center",
                autoClose: 2000,
            });

            const { token, role, name, id } = res.data;

            login({ token, role, name, id });

            // Navigate based on role
            if (role === "USER") navigate(from, { replace: true });
            else if (role === "MANAGER") navigate("/manager/dashboard");
            else if (role === "ADMIN") navigate("/admin/dashboard");
            else navigate("/");
        } catch (err) {
            toast.error("Login failed !", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ToastContainer />

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign Up here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
