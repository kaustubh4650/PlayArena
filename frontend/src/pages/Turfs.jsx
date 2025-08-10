import React, { useEffect, useState } from "react";
import { getAllTurfs } from "../api/turfApi";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { MdCategory } from "react-icons/md";

const Turfs = () => {
    const [turfs, setTurfs] = useState([]);
    const [filteredTurfs, setFilteredTurfs] = useState([]);
    const [locationFilter, setLocationFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const data = await getAllTurfs();
                setTurfs(data);
                setFilteredTurfs(data);
            } catch (err) {
                console.error("Error fetching turfs", err);
            }
        };
        fetchTurfs();
    }, []);

    useEffect(() => {
        // Apply filters whenever the user changes location or category
        const filtered = turfs.filter((turf) => {
            const locationMatch = turf.location.toLowerCase().includes(locationFilter.toLowerCase());
            const categoryMatch = categoryFilter
                ? turf.category.toLowerCase() === categoryFilter.toLowerCase()
                : true;
            return locationMatch && categoryMatch;
        });

        setFilteredTurfs(filtered);
    }, [locationFilter, categoryFilter, turfs]);

    return (
        <div className="p-6">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-end">
                <label className="text-lg font-semibold">Find your turf</label>

                {/* Location Search */}
                <input
                    type="text"
                    placeholder="Search by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-48"
                >
                    <option value="">All Categories</option>
                    <option value="FOOTBALL">Football</option>
                    <option value="CRICKET">Cricket</option>
                    <option value="HOCKEY">Hockey</option>
                    <option value="BADMINTON">Badminton</option>
                    <option value="BASKETBALL">BasketBall</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredTurfs.map((turf) => (
                    <div
                        key={turf.turfId}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
                        onClick={() => navigate(`/turfs/${turf.turfId}`)}
                    >

                        <div className="h-48 overflow-hidden">
                            <img
                                src={`http://localhost:8080/${turf.imagePath}`}
                                alt={turf.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-2">

                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 truncate">{turf.name}</h2>
                                <span className="text-green-600 font-semibold flex items-center gap-1 text-sm">
                                    <FaRupeeSign className="text-sm" />
                                    {turf.pricePerHour}/hr
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 flex items-start gap-2 mt-1">
                                <AiOutlineFileText className="text-gray-400 mt-0.5" />
                                <span className="line-clamp-2">{turf.description}</span>
                            </p>


                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <FiMapPin className="text-gray-400" />
                                {turf.location}
                            </p>

                            <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                                <MdCategory className="text-gray-500" />
                                <span className="capitalize">{turf.category}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Turfs;
