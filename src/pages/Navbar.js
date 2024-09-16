import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="bg-transparent container text-white font-main flex items-center justify-between sticky top-0 z-50 py-4 px-10 mx-auto">
            {/* Logo Section */}
            <a href="/" className="flex flex-col justify-center -space-y-2.5 transition-transform transform hover:scale-110">
                <div className="flex items-end gap-1">
                    <p className="font-extrabold text-2xl">F1</p>
                    <div className="text-[3px] w-2 mb-1">
                        ⠀⢀⣀⣀⣀⠀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⢸⣿⣿⡿⢀⣠⣴⣾⣿⣿⣿⣿⣇⡀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⢸⣿⣿⠟⢋⡙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣿⡿⠓⡐⠒⢶⣤⣄⡀⠀⠀
                        ⠀⠸⠿⠇⢰⣿⣿⡆⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⡷⠈⣿⣿⣉⠁⠀
                        ⠀⠀⠀⠀⠀⠈⠉⠀⠈⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠀⠈⠉⠁⠀⠈⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀
                    </div>
                </div>
                <p className="font-bold text-[23px]">Analytics</p>
            </a>

            {/* Links Section */}
            <div className="flex space-x-10 px-10 py-4 font-bold text-lg rounded-full bg-[#ffffff] bg-opacity-5 backdrop-blur-sm z-[100] animate-slide-in drop-shadow-md">
                <Link to="/" className="hover:text-gray-400 transition-colors duration-300">Home</Link>
                <Link to="race-analysis" className="hover:text-gray-400 transition-colors duration-300">Race Analysis</Link>
                <Link to="qualifying-analysis" className="hover:text-gray-400 transition-colors duration-300">Qualifying Analysis</Link>
            </div>

            {/* Notify Button */}
            <div className="flex items-center justify-center font-bold text-lg bg-[#ffffff] bg-opacity-5 backdrop-blur-sm z-[100] animate-slide-in drop-shadow-md px-6 py-4 rounded-full transition-colors duration-300">
                <a href="https://tirthp14.github.io/personal-portfolio/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-300">&lt;About me/&gt;</a>
            </div>
        </div>
    );
}

export default Navbar;