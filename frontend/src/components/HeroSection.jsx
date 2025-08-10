import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="relative h-[95vh] flex items-center justify-center text-white overflow-hidden ">

            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="/videos/turf-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>



            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between w-full">

                <div className="w-full md:w-1/2 md:pl-5">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        DISCOVER YOUR <span className="text-green-400">GAME ZONE</span>
                    </h1>
                    <p className="text-gray-200 text-lg mb-8">
                        Explore top-rated turfs near you, reserve in seconds, and rally your squad for the next big match — anytime, anywhere.
                    </p>
                    <Link
                        to="/turfs"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        Book Turf
                    </Link>
                </div>
            </div>

        </section>
    );
};

export default HeroSection;


// import React from "react";
// import { Link } from "react-router-dom";

// const HeroSection = () => {
//     return (
//         <section
//             className="relative h-[90vh] flex items-center justify-center text-black bg-cover bg-center"
//             style={{ backgroundImage: "url('/images/bannerImage.png')" }}
//         >

//             <div className="relative z-20 max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between w-full">
//                 <div className="w-full md:w-1/2">
//                     <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
//                         DISCOVER YOUR <span className="text-green-400">GAME ZONE</span>
//                     </h1>
//                     <p className="text-black text-lg mb-8">
//                         Explore top-rated turfs near you, reserve in seconds, and rally your <br /> squad for the next big match — anytime, anywhere.
//                     </p>
//                     <Link
//                         to="/turfs"
//                         className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
//                     >
//                         Book Turf
//                     </Link>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HeroSection;

