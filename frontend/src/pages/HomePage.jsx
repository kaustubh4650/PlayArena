import React, { useEffect, useState } from "react";
import { getAllTurfs } from "../api/turfApi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [turfs, setTurfs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const data = await getAllTurfs();
                setTurfs(data);
            } catch (err) {
                console.error("Error fetching turfs", err);
            }
        };
        fetchTurfs();
    }, []);

    return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {turfs.map((turf) => (
                <div
                    key={turf.turfId}
                    className="bg-white shadow-md rounded-2xl p-4 cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate(`/turfs/${turf.turfId}`)}
                >
                    <img
                        src={
                            `http://localhost:8080/${turf.imagePath}`
                        }
                        alt={turf.name}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                    <h2 className="text-xl font-semibold">{turf.name}</h2>
                    <p className="text-gray-600">{turf.location}</p>
                    <p className="text-green-600 font-medium">
                        ₹{turf.pricePerHour}/hr
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{turf.description}</p>
                </div>
            ))
            }
        </div >
    );
};

export default HomePage;
