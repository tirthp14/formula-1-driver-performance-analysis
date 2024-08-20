import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext";
import { fetchSessionKey } from "../utils/FetchSessionKey";
import RaceResults from "../components/RaceResults";
import LapData from "../components/LapData";
import TyreStrategy from "../components/TyreStrategy";

const RaceAnalysis = () => {
    const { setRaceSessionKey } = useContext(SessionContext);
    const [year, setYear] = useState("");
    const [country, setCountry] = useState("");
    const [locations, setLocations] = useState([]);
    const [raceResultsOrder, setRaceResultsOrder] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (year) {
                const response = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
                const data = await response.json();

                setLocations(data);
            }
        };

        fetchLocations();
    }, [year]);

    useEffect(() => {
        const fetchRaceSessionKey = async () => {
            if (year && country) {
                const sessionKey = await fetchSessionKey(country, "Race", year);

                setRaceSessionKey(sessionKey);
            }
        }

        fetchRaceSessionKey();
    }, [country, year, setRaceSessionKey]);

    return (
        <div className="font-main p-6 bg-gradient-to-b from-gray-900 to-gray-700 min-h-screen text-white">
            <div className="flex justify-center mb-6 space-x-4">
                <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-teal-400" onChange={(e) => setYear(e.target.value)} value={year}>
                    <option value="">Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <select className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-teal-400" onChange={(e) => setCountry(e.target.value)} value={country}>
                    <option value="">Select Grand Prix</option>
                    {locations.map(location => (
                        <option key={location.meeting_key} value={location.country_name}>{location.meeting_name}</option>
                    ))}
                </select>
            </div>
            <div className="bg-gray-800 rounded-3xl">
                <RaceResults setRaceResultsOrder={setRaceResultsOrder} />
                <LapData />
                <TyreStrategy raceResultsOrder={raceResultsOrder} />
            </div>
        </div>
    );
};

export default RaceAnalysis;