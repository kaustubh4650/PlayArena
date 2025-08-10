import React from 'react';
import { FaClock, FaStar } from 'react-icons/fa';
import { GiSoccerField } from 'react-icons/gi';

const FeatureSection = () => {
    return (
        <div className="py-12 bg-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
                <div className="grid md:grid-cols-3 gap-8">

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-center">
                        <div className="text-green-500 text-4xl mb-4 flex justify-center">
                            <FaClock />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                        <p>Book turfs in real-time with just a few clicks – fast, easy, and reliable.</p>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-center">
                        <div className="text-green-600 text-4xl mb-4 flex justify-center">
                            <GiSoccerField />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Top-Quality Turfs</h3>
                        <p>Choose from a wide range of well-maintained turfs for football, cricket, and more.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition text-center">
                        <div className="text-green-500 text-4xl mb-4 flex justify-center">
                            <FaStar />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Genuine Reviews</h3>
                        <p>See ratings and feedback from other players to make the best choice for your game.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureSection;
