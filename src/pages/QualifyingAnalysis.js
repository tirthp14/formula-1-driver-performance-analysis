import React, { useContext, useState, useEffect } from "react";
import { SessionContext } from "../utils/SessionContext";
import { fetchSessionKey } from "../utils/FetchSessionKey";
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
                
                setLocations(data);
            }
        };

        fetchLocations();
    }, [year]);

    useEffect(() => {
        const fetchQualifyingSessionKey = async () => {
            if (year && country) {
                const sessionKey = await fetchSessionKey(country, "Qualifying", year);

                setQualifyingSessionKey(sessionKey);
            }
        }

        fetchQualifyingSessionKey();
    }, [country, year, setQualifyingSessionKey]);

    return (
        <div className="font-main text-neutral-100 min-h-screen bg-gradient-to-b from-gray-950 to-gray-800 pt-2 pb-6">
            <div className="container mx-auto px-10">
                <div className="mb-6 flex justify-center space-x-4">
                    <select 
                        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-teal-400"
                        onChange={(e) => setYear(e.target.value)} 
                        value={year}
                    >
                        <option value="">Select Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                    <select 
                        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-teal-400"
                        onChange={(e) => setCountry(e.target.value)} 
                        value={country}
                    >
                        <option value="">Select Grand Prix</option>
                        {locations.map(location => (
                            <option key={location.meeting_key} value={location.country_name}>
                                {location.meeting_name}
                            </option>
                        ))}
                    </select>
                </div>

                {year && country ? (
                    <div className="bg-gray-900 text-white rounded-3xl shadow-md">
                        <div className="p-3 bg-gray-700/40 rounded-t-3xl">
                            <h1 className="text-[42px] font-extrabold tracking-wide ml-5">{year} {country} - Qualifying Analysis</h1>
                        </div>
                        <div className="p-5 space-y-8">
                            <CarData />
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-900 text-white rounded-3xl shadow-md">
                        <div className="flex relative justify-center space-y-8">
                            <img className='w-1/3 h-1/3 z-50' src={require('../assets/lotties/Loading Lottie.gif')} />
                            <h className='absolute bottom-5 z-0 text-3xl font-bold animate-pulse tracking-wider'>Loading...</h>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QualifyingAnalysis;