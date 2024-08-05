import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext"
import { fetchSessionKey } from "../utils/FetchSessionKey";
import StartingGrid from "../components/StartingGrid";
import CarData from "../components/CarData";

const QualifyingAnalysis = () => {
    const { setQualifyingSessionKey } = useContext(SessionContext);
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
        <div className="font-main text-neutral-100">
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

            <div className="px-16">
                {year && country && (
                    <div className="flex uppercase text-4xl font-extrabold tracking-wide py-4">
                        <h1>{year}</h1>
                        <h1 className="pl-2">{country}</h1>
                        <p className="px-2">-</p>
                        <h1>Qualifying Analysis</h1>
                    </div>
                )}

                <CarData />
                <StartingGrid />
            </div>

        </div>
    )
}

export default QualifyingAnalysis;