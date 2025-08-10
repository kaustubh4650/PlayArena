import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "react-avatar";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const { isLoggedIn, name, role, logout, id, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleLoginRedirect = () => {
        navigate("/login", { state: { from: location } });
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center">
                <img
                    src="/images/icon.png"
                    alt="PlayArena Logo"
                    className="h-8 w-full object-contain"
                />
                <span className="text-xl font-bold text-green-600 py-1">PlayArena</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-4">
                {!isLoggedIn ? (
                    <button
                        onClick={handleLoginRedirect}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                ) : (
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <Avatar name={name} size="36" round="50%" />
                            <span className="text-gray-700 font-medium">{name}</span>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                                {location.pathname.includes("dashboard") ? (
                                    <Link
                                        to="/"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Home
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/${role.toLowerCase()}/dashboard`}
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-t md:hidden z-40 shadow-lg">
                    <div className="p-4 flex flex-col gap-3">
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLoginRedirect}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <Avatar name={name} size="36" round="50%" />
                                    <span className="font-medium">{name}</span>
                                </div>
                                {location.pathname.includes("dashboard") ? (
                                    <Link
                                        to="/"
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/${role.toLowerCase()}/dashboard`}
                                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-red-500 hover:underline"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;


