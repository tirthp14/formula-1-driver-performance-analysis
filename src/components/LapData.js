import React, { useContext, useState, useEffect } from 'react';
import { SessionContext } from "../utils/SessionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LapData = ({ sessionKey }) => {
    const { raceSessionKey } = useContext(SessionContext);
    const [lapData, setLapData] = useState({});
    const [selectedDrivers, setSelectedDrivers] = useState([1, 2, 3, 4, 10, 11, 14, 16, 18, 20, 22, 23, 24, 27, 31, 44, 55, 63, 77, 81]);
    const [driverVisibility, setDriverVisibility] = useState({});
    const [driverColors, setDriverColors] = useState({});

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

                    initialVisibility[`Driver ${driver}`] = true;
                    newColors[`Driver ${driver}`] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                } catch (error) {
                    console.log("Error fetching Lap Data: ", error);
                }
            }

            setDriverVisibility(initialVisibility);
            setDriverColors(newColors);
        };

        fetchLapData();
    }, [raceSessionKey]);

    const prepareChartData = () => {
        const combinedLapData = Object.values(lapData).flat();
        const lapNumbers = [...new Set(combinedLapData.map(lap => lap.lapNumber))].sort((a, b) => a - b);

        const chartData = lapNumbers.map(lapNumber => {
            const lapDataForAllDrivers = { lapNumber: lapNumber };
            selectedDrivers.forEach(driver => {
                const lapForDriver = combinedLapData.find(lap => lap.lapNumber === lapNumber && lap.driverNumber === driver);
                if (lapForDriver) {
                    lapDataForAllDrivers[`Driver ${driver}`] = lapForDriver.lapDuration;
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
    const minLapDuration = Math.min(...chartData.flatMap(d => selectedDrivers.map(driver => parseFloat(d[`Driver ${driver}`]) || Infinity)));
    const maxLapDuration = Math.max(...chartData.flatMap(d => selectedDrivers.map(driver => parseFloat(d[`Driver ${driver}`]) || -Infinity)));

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
                            driverVisibility[`Driver ${driver}`] && (
                                <Line
                                    key={driver}
                                    type="monotone"
                                    dataKey={`Driver ${driver}`}
                                    stroke={driverColors[`Driver ${driver}`]}
                                    activeDot={{ r: 8 }}
                                    name={`Driver ${driver}`}
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
                        onClick={() => handleDriverVisibilityChange(`Driver ${driver}`)}
                        style={{ backgroundColor: driverVisibility[`Driver ${driver}`] ? driverColors[`Driver ${driver}`] : '#333333' }}
                    >
                        Driver {driver}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LapData;