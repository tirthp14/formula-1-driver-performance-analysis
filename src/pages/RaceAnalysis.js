import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext";
import { fetchSessionKey } from "../utils/FetchSessionKey";
import RaceResults from "../components/RaceResults";
import WindData from "../components/WindData";
import Footer from "./Footer";

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

                setLocations(data);
            }
        };

        fetchLocations();
    }, [year]);

    useEffect(() => {
        const fetchRaceSessionKey = async () => {
            if (year && country) {
                const sessionKey = await fetchSessionKey(country, "Race", year);
                console.log(sessionKey) // Remember to remove this

                setRaceSessionKey(sessionKey);
            }
        }

        fetchRaceSessionKey();
    }, [country, year, setRaceSessionKey]);

    return (
        <div>
            <div className="font-main pt-2 pb-6 bg-gradient-to-b from-gray-950 to-gray-800 min-h-screen text-white">
                <div className="container mx-auto px-10">
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
                    <div className="bg-gray-900 rounded-3xl shadow-md">
                        <div className="flex p-3 justify-between bg-gray-700/40 rounded-t-3xl">
                            {year && country && (
                                <div>
                                    <h1 className="text-[42px] font-extrabold tracking-wide ml-5">{year} {country} - Race Analysis</h1>
                                </div>
                            )}
                            <WindData />
                        </div>
                        <RaceResults />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RaceAnalysis;