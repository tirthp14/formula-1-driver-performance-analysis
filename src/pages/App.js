import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import RaceAnalysis from "./RaceAnalysis";
import QualifyingAnalysis from "./QualifyingAnalysis";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="race-analysis" element={<RaceAnalysis />} />
      <Route path="qualifying-analysis" element={<QualifyingAnalysis />} />
    </Routes>
  )
}

export default App;