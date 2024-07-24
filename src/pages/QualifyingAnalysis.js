import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext"
import { fetchSessionKey } from "../utils/FetchSessionKey";
import StartingGrid from "../components/StartingGrid";
import CarData from "../components/CarData";
import RaceTrack from "../components/RaceTrack";

const QualifyingAnalysis = () => {
    const { setQualifyingSessionKey } = useContext(SessionContext);
    const [year, setYear] = useState("");
    const [country, setCountry] = useState("");
    const [locations, setLocations] = useState([]);
    const [lapNumber, setLapNumber] = useState("");
    const [driverNumber, setDriverNumber] = useState("");

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
        const fetchQualifyingSessionKey = async () => {
            if (year && country) {
                const sessionKey = await fetchSessionKey(country, "Qualifying", year);
                console.log("Session Key: ", sessionKey); // Remember to remove this

                setQualifyingSessionKey(sessionKey);
            }
        }

        fetchQualifyingSessionKey();
    }, [country, year, setQualifyingSessionKey])

    return (
        <div>
            <h2>Qualifying Analysis</h2>
            <select onChange={(e) => setYear(e.target.value)} value={year}>
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
            </select>
            <select onChange={(e) => setCountry(e.target.value)} value={country}>
                <option value="">Select Grand Prix</option>
                {locations.map(location => (
                    <option key={location.meeting_key} value={location.country_name}>{location.meeting_name}</option>
                ))}
            </select>

            <StartingGrid />
            <CarData setLapNumber={setLapNumber} setDriverNumber={setDriverNumber} />
            <RaceTrack lapNumber={lapNumber} driverNumber={driverNumber} />
        </div>
    )
}

export default QualifyingAnalysis;