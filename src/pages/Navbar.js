import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-[#ffffff] bg-opacity-0 md:bg-opacity-20 backdrop-blur-sm text-white h-14 w-full">
            <Link to="/">Home</Link>
            <Link to="race-analysis">Race Analysis</Link>
            <Link to="qualifying-analysis">Qualifying Analysis</Link>
        </nav>
    );
  }
  
  export default Navbar;