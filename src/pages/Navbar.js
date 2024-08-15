import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div>
            <nav className="bg-[#ffffff] bg-opacity-0 md:bg-opacity-20 backdrop-blur-sm text-white h-14 w-full">
                <Link to="/">HOME</Link>
                <Link to="race-analysis">RACE ANALYSIS</Link>
                <Link to="qualifying-analysis">QUALIFYING ANALYSIS</Link>
            </nav>
        </div>
    );
  }
  
  export default Navbar;