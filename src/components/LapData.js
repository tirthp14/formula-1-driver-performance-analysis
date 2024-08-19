import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from "../utils/SessionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LapData = () => {
    const { raceSessionKey } = useContext(SessionContext);
    const [lapData, setLapData] = useState({});
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [driverVisibility, setDriverVisibility] = useState({});
    const [driverColors, setDriverColors] = useState({});
    const [driverAcronyms, setDriverAcronyms] = useState({});

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const response = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
                const data = await response.json();

                const driverNumbers = data.map(driver => driver.driver_number);
                setSelectedDrivers(driverNumbers);
                
                const acronyms = data.reduce((acc, driver) => {
                    acc[driver.driver_number] = driver.name_acronym;
                    return acc;
                }, {});
                setDriverAcronyms(acronyms);
            } catch (error) {
                console.log("Error fetching driver details: ", error);
            }
        };

        if (raceSessionKey) {
            fetchDriverDetails();
        }
    }, [raceSessionKey]);

    useEffect(() => {
        const fetchLapData = async () => {
            const initialVisibility = {};
            const newColors = {};

            for (let driver of selectedDrivers) {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${raceSessionKey}&driver_number=${driver}`);
                    const data = await response.json();

                    const formattedData = data
                        .filter(lap => lap.lap_duration !== null)
                        .map(lap => ({
                            lapNumber: lap.lap_number,
                            lapDuration: parseFloat((lap.lap_duration) / 60).toFixed(3),
                            driverNumber: driver,
                        }));

                    setLapData(prevData => ({
                        ...prevData,
                        [driver]: formattedData
                    }));

                    // Set default visibility and color for new drivers
                    if (!initialVisibility[driver]) {
                        initialVisibility[driver] = true;
                    }
                    if (!newColors[driver]) {
                        newColors[driver] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                    }

                } catch (error) {
                    console.log(`Error fetching lap data for driver ${driver}:`, error);
                }
            }

            setDriverVisibility(initialVisibility);
            setDriverColors(newColors);
        };

        if (selectedDrivers.length > 0) {
            fetchLapData();
        }
    }, [selectedDrivers, raceSessionKey]);

    const handleDriverVisibilityChange = (driver) => {
        setDriverVisibility(prevVisibility => ({
            ...prevVisibility,
            [driver]: !prevVisibility[driver]
        }));
    };

    const data = selectedDrivers.reduce((acc, driver) => {
        if (lapData[driver]) {
            lapData[driver].forEach(lap => {
                if (!acc[lap.lapNumber]) {
                    acc[lap.lapNumber] = { lapNumber: lap.lapNumber };
                }
                acc[lap.lapNumber][driver] = lap.lapDuration;
            });
        }
        return acc;
    }, {});

    const formattedData = Object.values(data);

    return (
        <div className="p-6 bg-gray-800">
            <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Lap Times:</p>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lapNumber" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        {selectedDrivers.map(driver => (
                            driverVisibility[driver] && (
                                <Line
                                    key={driver}
                                    type="monotone"
                                    dataKey={driver}
                                    stroke={driverColors[driver]}
                                    activeDot={{ r: 8 }}
                                    name={`Driver ${driverAcronyms[driver] || driver}`}
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {selectedDrivers.map((driver, index) => (
                    <button
                        key={index}
                        className="py-1 px-4 text-white font-semibold rounded"
                        onClick={() => handleDriverVisibilityChange(driverAcronyms[driver] || `Driver ${driver}`)}
                        style={{ backgroundColor: driverVisibility[driverAcronyms[driver] || `Driver ${driver}`] ? driverColors[driverAcronyms[driver] || `Driver ${driver}`] : '#333333' }}
                    >
                        {driverAcronyms[driver] || `Driver ${driver}`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LapData;
