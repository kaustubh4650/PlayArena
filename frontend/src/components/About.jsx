import React from 'react'

const About = () => {
    return (
        <>
            <div className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-6">

                    <h2 className="text-3xl font-bold text-center mb-10">About PlayArena</h2>

                    <div className="flex flex-col md:flex-row md:pl-10 items-center justify-between gap-10">

                        <div className="md:w-1/2 text-center md:text-left">
                            <p className="text-lg">
                                PlayArena is your one-stop destination for discovering and booking premium sports turfs in your city. Whether you're into football, cricket, badminton, or any other turf sport, we make it easy for you to find the perfect venue. Our platform is built to eliminate the hassle of phone calls and long wait times — offering you a fast, seamless booking experience. With real-time availability, transparent pricing, and reliable customer support, PlayArena ensures that your game time is always just a few taps away. Join a growing community of sports lovers who play smarter, not harder.
                            </p>

                        </div>

                        <div className="md:w-1/2 md:pl-30">
                            <img
                                src="/images/img1.png"
                                alt="About PlayArena"
                                className="w-80 h-auto rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About

