import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from "../utils/SessionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CarData = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [laps, setLaps] = useState([], []);
    const [selectedLaps, setSelectedLaps] = useState([]);
    const [graphingData, setGraphingData] = useState([]);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            if (qualifyingSessionKey) {
                const driverResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${qualifyingSessionKey}`);
                const driverData = await driverResponse.json();
    
                setDrivers(driverData);
            }
        };

        fetchDriverDetails();
    }, [qualifyingSessionKey]);

    useEffect(() => {
        const fetchLapInfo = async (index) => {
            if (qualifyingSessionKey && selectedDrivers[index]) {
                const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${qualifyingSessionKey}&driver_number=${selectedDrivers[index]}`);
                const data = await response.json();

                const filteredData = data.filter(lap => !lap.is_pit_out_lap && lap.lap_duration !== null);

                setLaps(prevLaps => {
                    const newLaps = [...prevLaps];
                    newLaps[index] = filteredData;
                    return newLaps
                });
            }
        };

        if (selectedDrivers[0]) fetchLapInfo(0);
        if (selectedDrivers[1]) fetchLapInfo(1);
    }, [qualifyingSessionKey, selectedDrivers]);

    const fetchCarData = async (qualifyingSessionKey, driverNumber) => {
        const response = await fetch(`https://api.openf1.org/v1/car_data?session_key=${qualifyingSessionKey}&driver_number=${driverNumber}`);
        const data = await response.json();

        return data;
    }

    const processData = async (index, dateStart, lapDuration) => {
        try {
            const data = await fetchCarData(qualifyingSessionKey, selectedDrivers[index])

            const startTime = new Date(dateStart).getTime();
            const endTime = startTime + lapDuration * 1000;

            const startIndex = findClosestIndex(data, startTime);
            const endIndex = findClosestIndex(data, endTime);

            const graphData = extractGraphData(data, startIndex, endIndex);
            
            setGraphingData(prevData => {
                const newData = [...prevData];
                newData[index] = graphData;
                return newData;
            })

            console.log(graphData);
        } catch (error) {
            console.log("Error fetching Graph Data: ", error);
        }
    }
    
    const findClosestIndex = (data, targetTime) => {
        return data.reduce((closestIndex, entry, index) => {
            const entryTime = new Date(entry.date).getTime();
            const diff = Math.abs(entryTime - targetTime);
            return diff < Math.abs(new Date(data[closestIndex].date).getTime() - targetTime) ? index : closestIndex;
        }, 0)
    }
    
    const extractGraphData = (data, startIndex, endIndex) => data.slice(startIndex, endIndex + 1);
    
    const handleDriverChange = (index, value) => {
        setSelectedDrivers(prevDrivers => {
            const newDrivers = [...prevDrivers];
            newDrivers[index] = value;
            return newDrivers;
        });
    };

    const handleLapChange = (index, value) => {
        const selectedLap = laps[index]?.find(lap => lap.lap_number === parseInt(value));

        setSelectedLaps(prevLaps => {
            const newLaps = [...prevLaps];
            newLaps[index] = selectedLap;
            return newLaps;
        });

        processData(index, selectedLap.date_start, selectedLap.lap_duration);
    };

    return (
        <div className='text-white'>
            <h2>Car Data</h2>
            {qualifyingSessionKey ? (
                <>
                    {[0, 1].map((index) => (
                        <div key={index}>
                            <div>
                                <label>
                                    Select Driver {index + 1}:
                                    <select className='text-gray-900' value={selectedDrivers[index]} onChange={(e) => handleDriverChange(index, e.target.value)}>
                                        <option value="">Select a Driver</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.driver_number} value={driver.driver_number}>
                                                {driver.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    Select Lap for Driver {index + 1}:
                                    <select className='text-gray-900' value={selectedLaps[index]} onChange={(e) => handleLapChange(index, e.target.value)}>
                                        <option value="">Select a Lap</option>
                                        {laps[index]?.map((lap, lapIndex) => (
                                            <option key={lapIndex} value={lap.lap_number}>
                                                Lap {lap.lap_number} - {lap.lap_duration}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>
                    ))}
                    <div>
                    <p>Selected Lap for Driver 1: {selectedLaps[0]?.lap_number}</p>
                    <p>Selected Lap for Driver 2: {selectedLaps[1]?.lap_number}</p>
                    </div>
                    <div className='relative w-2/5'>
                        {selectedLaps[0] && (
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '300px', zIndex: 1 }}>
                                <h3>Driver 1 - Lap {selectedLaps[0]?.lap_number}</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={graphingData[0]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="speed" stroke="#8884d8" dot={false}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {selectedLaps[1] && (
                            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '300px', zIndex: 0 }}>
                                <h3>Driver 2 - Lap {selectedLaps[1]?.lap_number}</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={graphingData[1]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="speed" stroke="#82ca9d" dot={false}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CarData;