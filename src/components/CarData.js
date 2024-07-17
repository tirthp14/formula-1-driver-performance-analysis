import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from "../utils/SessionContext";

const CarData = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [laps, setLaps] = useState([], []);
    const [selectedLaps, setSelectedLaps] = useState([]);


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

                setLaps(prevLaps => {
                    const newLaps = [...prevLaps];
                    newLaps[index] = data;
                    return newLaps
                });
            }
        };

        if (selectedDrivers[0]) fetchLapInfo(0);
        if (selectedDrivers[1]) fetchLapInfo(1);
    }, [qualifyingSessionKey, selectedDrivers]);

    const handleDriverChange = (index, value) => {
        setSelectedDrivers(prevDrivers => {
            const newDrivers = [...prevDrivers];
            newDrivers[index] = value;
            return newDrivers;
        });
    };

    const handleLapChange = (index, value) => {
        setSelectedLaps(prevLaps => {
            const newLaps = [...prevLaps];
            newLaps[index] = value;
            return newLaps;
        });
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
                                    <select className='text-black' value={selectedDrivers[index]} onChange={(e) => handleDriverChange(index, e.target.value)}>
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
                                    <select className='text-black' value={selectedLaps[index]} onChange={(e) => handleLapChange(index, e.target.value)}>
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
                        <p>Selected Lap for Driver 1: {selectedLaps[0]}</p>
                        <p>Selected Lap for Driver 2: {selectedLaps[1]}</p>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CarData;