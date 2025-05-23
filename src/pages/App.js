import React from "react";
import { Routes, Route } from "react-router-dom";
import { SessionProvider } from "../utils/SessionContext";
import Home from "./Home";
import RaceAnalysis from "./RaceAnalysis";
import QualifyingAnalysis from "./QualifyingAnalysis";
import Navbar from "./Navbar";

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <SessionProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="race-analysis" element={<RaceAnalysis />} />
        <Route path="qualifying-analysis" element={<QualifyingAnalysis />} />
      </Routes>
      <Analytics/>
    </SessionProvider>
  )
}

export default App;