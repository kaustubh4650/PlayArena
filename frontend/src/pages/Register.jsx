import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";


const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",

    });

    const [errors, setErrors] = useState("");


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors("");
    };

    const validateForm = () => {
        const { name, email, password, address, phone } = formData;
        const newErrors = {};

        if (!/^[A-Za-z\s]{3,}$/.test(name)) {
            newErrors.name = "Name must be at least 3 letters and contain only letters";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
            newErrors.password = "Password must be at least 6 characters and contain both letters and numbers";
        }

        if (address.trim().length < 3) {
            newErrors.address = "Address must be at least 3 characters";
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phone.trim()) newErrors.phone = "Phone is required.";
        else if (!phoneRegex.test(phone))
            newErrors.phone = "Phone number must be 10 digits.";

        return newErrors;
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }


        try {
            const response = await registerUser(formData);

            toast.success("Registration successful! Please login.", {
                position: "top-center",
                autoClose: 2000,
            });

            navigate("/login");
        } catch (err) {
            toast.error("Registration failed !", {
                position: "top-center",
                autoClose: 2000,
            });
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <ToastContainer />

            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
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
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
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
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
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
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">phone</label>
                    <input
                        type="text"
                        name="phone"
                        required
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        maxLength={10}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;