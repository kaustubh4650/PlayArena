import React from 'react'
import { FaSearchLocation, FaRegCalendarCheck, FaFutbol } from "react-icons/fa";

const WorkSection = () => {
    return (
        <>
            <div className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-10">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">

                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
                            <FaSearchLocation className="text-green-500 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Find a Turf</h3>
                            <p>Explore top-rated sports venues near you with location-based search.</p>
                        </div>


                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
                            <FaRegCalendarCheck className="text-green-500 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
                            <p>Select your slot, confirm availability, and book within seconds.</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
                            <FaFutbol className="text-green-500 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Play & Enjoy</h3>
                            <p>Show up, play your heart out, and enjoy a hassle-free sports experience.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default WorkSection