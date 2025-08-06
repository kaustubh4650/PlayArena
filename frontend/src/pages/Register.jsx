import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";

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

        if (!name.trim()) newErrors.name = "Name is required.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

        if (!password.trim()) newErrors.password = "Password is required.";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (!address.trim()) newErrors.address = "Address is required.";

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
            console.log("User registered:", response);

            alert("Registration successful! Please login.");

            navigate("/login");
        } catch (err) {
            alert("Registration failed:", err);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;