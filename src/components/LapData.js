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
                setSelectedDrivers(driverNumbers)
                
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
                        [driver]: formattedData,
                    }));

                    initialVisibility[driverAcronyms[driver] || `Driver ${driver}`] = true;
                    newColors[driverAcronyms[driver] || `Driver ${driver}`] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                } catch (error) {
                    console.log("Error fetching Lap Data: ", error);
                }
            }

            setDriverVisibility(initialVisibility);
            setDriverColors(newColors);
        };

        if (raceSessionKey && Object.keys(driverAcronyms).length > 0) {  
            fetchLapData();
        }
    }, [raceSessionKey, driverAcronyms]);

    const prepareChartData = () => {
        const combinedLapData = Object.values(lapData).flat();
        const lapNumbers = [...new Set(combinedLapData.map(lap => lap.lapNumber))].sort((a, b) => a - b);

        const chartData = lapNumbers.map(lapNumber => {
            const lapDataForAllDrivers = { lapNumber: lapNumber };
            selectedDrivers.forEach(driver => {
                const lapForDriver = combinedLapData.find(lap => lap.lapNumber === lapNumber && lap.driverNumber === driver);
                if (lapForDriver) {
                    lapDataForAllDrivers[driverAcronyms[driver] || `Driver ${driver}`] = lapForDriver.lapDuration;
                }
            });
            return lapDataForAllDrivers;
        });

        return chartData;
    };

    const formatYAxisTick = (tick) => {
        const minutes = Math.floor(tick);
        const seconds = ((tick - minutes) * 60).toFixed(3);
        return `${minutes}:${seconds.padStart(6, '0')}`;
    };

    const handleDriverVisibilityChange = (driver) => {
        setDriverVisibility(prevState => ({
            ...prevState,
            [driver]: !prevState[driver]
        }));
    };

    const chartData = prepareChartData();
    const minLapDuration = Math.min(...chartData.flatMap(d => selectedDrivers.map(driver => parseFloat(d[driverAcronyms[driver] || `Driver ${driver}`]) || Infinity)));
    const maxLapDuration = Math.max(...chartData.flatMap(d => selectedDrivers.map(driver => parseFloat(d[driverAcronyms[driver] || `Driver ${driver}`]) || -Infinity)));

    return (
        <div>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lapNumber" />
                        <YAxis
                            tickFormatter={formatYAxisTick}
                            label={{ value: 'Lap Duration (MM:SS.mmm)', angle: -90, position: 'insideLeft' }}
                            domain={[minLapDuration - 0.05, maxLapDuration + 0.05]}
                        />
                        <Tooltip
                            formatter={(value) => {
                                const decimalMinutes = parseFloat(value);
                                const minutes = Math.floor(decimalMinutes);
                                const totalSeconds = (decimalMinutes - minutes) * 60;
                                const seconds = Math.floor(totalSeconds);
                                const milliseconds = Math.round((totalSeconds - seconds) * 1000);
                                return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                            }}
                        />
                        <Legend />
                        {selectedDrivers.map(driver => (
                            driverVisibility[driverAcronyms[driver] || `Driver ${driver}`] && (
                                <Line
                                    key={driver}
                                    type="monotone"
                                    dataKey={driverAcronyms[driver] || `Driver ${driver}`}
                                    stroke={driverColors[driverAcronyms[driver] || `Driver ${driver}`]}
                                    activeDot={{ r: 8 }}
                                    name={driverAcronyms[driver] || `Driver ${driver}`}
                                />
                            )
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading chart data...</p>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {selectedDrivers.map((driver, index) => (
                    <button
                        key={index}
                        className={`py-1 px-4 text-white font-semibold rounded`}
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