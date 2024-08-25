import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from "../utils/SessionContext";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LapData = () => {
    const { raceSessionKey } = useContext(SessionContext);
    const [lapData, setLapData] = useState({});
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [driverVisibility, setDriverVisibility] = useState({});
    const [driverColors, setDriverColors] = useState({});
    const [driverAcronyms, setDriverAcronyms] = useState({});
    const [hoveredDriver, setHoveredDriver] = useState(null);

    const predefinedColors = {
        44: '#25f5d3',
        1: '#3770c5',
        16: '#ea001b',
        63: '#6cfffc',
        81: '#ffcc4c',
        4: '#ff7f00',
        55: '#fe4d6f',
        11: '#83bfff',
        14: '#219a71',
        31: '#4edffc',
        3: '#6692fc',
        18: '#6de7be',
        23: '#afffff',
        10: '#0193cb',
        20: '#b6babd',
        77: '#a0fea1',
        22: '#b0dfff',
        2: '#63c5fd',
        27: '#ffffff',
        24: '#54e251',
        38: '#fe4d6f'
    };

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

            for (let i = 0; i < selectedDrivers.length; i++) {
                const driver = selectedDrivers[i];
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

                    initialVisibility[driver] = i < 3;

                    setDriverColors(prevColors => ({
                        ...prevColors,
                        [driver]: predefinedColors[driver] || '#000000'
                    }));

                } catch (error) {
                    console.log(`Error fetching lap data for driver ${driver}:`, error);
                }
            }

            setDriverVisibility(initialVisibility);
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
        <div className="p-6">
            {formattedData.length > 0 && (
                <>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-6">
                        <p className="text-lg font-semibold mb-4 text-gray-200">Lap Times</p>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={formattedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                                <XAxis dataKey="lapNumber" tick={{ fill: '#a1a1aa', fontSize: 15, fontWeight: 'bold' }} />
                                <YAxis domain={['auto', 'auto']} tick={{ fill: '#a1a1aa', fontSize: 15, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111827',
                                        borderColor: '#111827',
                                        color: '#ffffff',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(values, driver, props) => [`${values} min`, `${driverAcronyms[driver]} (Lap ${props.payload.lapNumber})`]}
                                />
                                <Legend wrapperStyle={{ color: '#ffffff' }} />
                                {selectedDrivers.map(driver => (
                                    driverVisibility[driver] && (
                                        <Line
                                            key={driver}
                                            type="natural"
                                            dataKey={driver}
                                            stroke={driverColors[driver]}
                                            strokeWidth={hoveredDriver === driver ? 3 : 2}
                                            activeDot={{ r: 10, stroke: '#ffffff', strokeWidth: 2 }}
                                            name={`${driverAcronyms[driver] || driver}`}
                                            dot={true}
                                            strokeDasharray={hoveredDriver === driver ? "5 5" : "0"}
                                            onMouseEnter={() => setHoveredDriver(driver)}
                                            onMouseLeave={() => setHoveredDriver(null)}
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
                                className="py-1 px-4 text-white font-bold text-lg rounded transition-all duration-200 ease-in-out transform hover:scale-105"
                                onClick={() => handleDriverVisibilityChange(driver)}
                                onMouseEnter={() => setHoveredDriver(driver)}
                                onMouseLeave={() => setHoveredDriver(null)}
                                style={{
                                    backgroundColor: driverVisibility[driver] ? driverColors[driver] : '#333333',
                                    boxShadow: driverVisibility[driver] ? `0px 0px 10px ${driverColors[driver]}` : 'none'
                                }}
                            >
                                {driverAcronyms[driver] || `${driver}`}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LapData;
