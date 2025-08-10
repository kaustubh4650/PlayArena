import React from 'react'
import { Link } from "react-router-dom";

const CTASection = () => {
    return (
        <>
            <div className="bg-green-600 text-white py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold mb-4">Hassle-Free Turf Booking</h2>
                    <p className="mb-6 text-lg">
                        Discover nearby sports turfs with ease and plan your game in just a few clicks — anytime, anywhere.
                    </p>
                    <Link
                        to="/turfs"
                        className="bg-white text-green-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
                    >
                        Explore Turfs
                    </Link>
                </div>
            </div>
        </>
    )
}

export default CTASection