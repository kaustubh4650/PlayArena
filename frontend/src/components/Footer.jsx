import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-7 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">


                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">PlayArena</h3>
                    <p className="text-sm text-gray-400 max-w-sm">
                        Discover, book, and play at top-quality turfs — hassle-free and at your fingertips.
                    </p>
                </div>


                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/turfs" className="hover:underline">View Turfs</a></li>
                    </ul>
                </div>


                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Us</h4>
                    <p className="text-sm text-gray-400 mb-3">Email: support@playarena.com</p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><FaSquareXTwitter /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><FaInstagram /></a>
                    </div>
                </div>

            </div>


            <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
                © 2025 PlayArena. All rights reserved.
            </div>
        </footer>

    );
};

export default Footer;
