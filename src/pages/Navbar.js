import { Link, Routes } from "react-router-dom";
import Home from "./App";
import RaceAnalysis from "./RaceAnalysis";
import QualifyingAnalysis from "./QualifyingAnalysis";

function Navbar() {
    return (
        <header className="bg-[#ffffff] bg-opacity-0 md:bg-opacity-20 backdrop-blur-sm text-white h-20 w-full">
            <Link to="/">Home</Link>
            <Link to="race-analysis">Race Analysis</Link>
            <Link to="qualifying-analysis">Qualifying Analysis</Link>
        </header>
    );
  }
  
  export default Navbar;