import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="text-white font-main flex items-center justify-between sticky top-0 z-50 py-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center bg-gray-900 h-10 w-10 rounded-full">
                <span className="text-2xl font-bold">F</span> {/* Replace with your logo */}
            </div>

            {/* Links Section */}
            <div className="flex space-x-10 px-10 py-4 font-bold text-lg rounded-full bg-[#ffffff] bg-opacity-5 back backdrop-blur z-[100] animate-slide-in drop-shadow-md">
                <Link to="/" className="hover:text-gray-400 transition-colors duration-300">Home</Link>
                <Link to="race-analysis" className="hover:text-gray-400 transition-colors duration-300">Race Analysis</Link>
                <Link to="qualifying-analysis" className="hover:text-gray-400 transition-colors duration-300">Qualifying Analysis</Link>
            </div>

            {/* Notify Button */}
            <div className="flex items-center justify-center bg-gray-900 px-4 py-1 rounded-full hover:bg-gray-800 transition-colors duration-300">
                <Link to="/notify" className="hover:text-gray-400 transition-colors duration-300">Notify me</Link>
            </div>
        </div>
    );
}

export default Navbar;