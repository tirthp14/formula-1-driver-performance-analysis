import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext"
import { fetchSessionKey } from "../utils/FetchSessionKey";
import RaceResults from "../components/RaceResults";
import LapData from "../components/LapData";

const RaceAnalysis = () => {
    const { setRaceSessionKey } = useContext(SessionContext);
    const [year, setYear] = useState("");
    const [country, setCountry] = useState("");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (year) {
                const response = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
                const data = await response.json();
                
                setLocations(data)
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
    }, [country, year, setRaceSessionKey])

    return (
        <div className="text-white">
            <h2>Race Analysis</h2>
            <select className="text-black" onChange={(e) => setYear(e.target.value)} value={year}>
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
            </select>
            <select className="text-black" onChange={(e) => setCountry(e.target.value)} value={country}>
                <option value="">Select Grand Prix</option>
                {locations.map(location => (
                    <option key={location.meeting_key} value={location.country_name}>{location.meeting_name}</option>
                ))}
            </select>

            <RaceResults />
            <div className="bg-white">
                <LapData />
            </div>
        </div>
    )
};

export default RaceAnalysis;