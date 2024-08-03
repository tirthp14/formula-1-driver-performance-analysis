import React, { useContext, useState, useEffect, useCallback } from 'react';
import RaceTrack from './RaceTrack';
import { formatLapTime } from '../utils/FormatTime';
import SegmentsDivs from './SectorTimes';
import { SessionContext } from "../utils/SessionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CarData = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [laps, setLaps] = useState([[], []]);
    const [selectedLaps, setSelectedLaps] = useState([null, null]);
    const [graphingData, setGraphingData] = useState([[], []]);
    const [lapNumber, setLapNumber] = useState("");
    const [driverNumber, setDriverNumber] = useState("");

    const colors = ["#8884d8", "#82ca9d"];

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
            });
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
    
    const extractGraphData = (data, startIndex, endIndex) => {
        return data.slice(startIndex, endIndex + 1).map(entry => ({
            date: new Date(entry.date).toLocaleTimeString(),
            speed: entry.speed,
            brake: entry.brake,
            throttle: entry.throttle,
            rpm: entry.rpm,
            drs: mapDrsValue(entry.drs),
            n_gear: entry.n_gear 
        }));
    };

    const mapDrsValue = (drs) => {
        const drsOnValues = [10, 12, 14];
        return drsOnValues.includes(drs) ? 1 : 0;
    }
    
    const handleDriverChange = (index, value) => {
        setSelectedDrivers(prevDrivers => {
            const newDrivers = [...prevDrivers];
            newDrivers[index] = value;
            return newDrivers;
        });
    };

    const handleLapChange = useCallback((index, value) => {
        const selectedLap = laps[index]?.find(lap => lap.lap_number === parseInt(value));

        setSelectedLaps(prevLaps => {
            const newLaps = [...prevLaps];
            newLaps[index] = selectedLap;
            return newLaps;
        });        
        
        if (selectedLap) {
            processData(index, selectedLap.date_start, selectedLap.lap_duration);
            setLapNumber(selectedLaps[0]?.lap_number);
        }

        if (index === 0 && selectedLap) {
            setLapNumber(selectedLap.lap_number);
            setDriverNumber(selectedDrivers[index]);
        }
        console.log(selectedLaps[0])
        console.log(selectedLaps[1])
    }, [laps, setLapNumber, setDriverNumber, selectedDrivers]);

    const renderCharts = useCallback((data, driverIndex) => (
        ["speed", "brake", "throttle", "rpm", "drs", "n_gear"].map((key, i) => (
            <div key={key} className='relative'>
                <h4 className='text-lg font-semibold mb-2'>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis tick={false} axisLine={false} />
                        <YAxis tick={{ fill: '#fff' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} labelStyle={{ color: '#fff' }} />
                        <Legend />
                        <Line type="monotone" dataKey={key} stroke={colors[driverIndex]} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        ))
    ), [colors]);

    const canRenderRaceTrack = selectedDrivers[0] && selectedDrivers[1] && selectedLaps[0] && selectedLaps[1];

    const calculateGap = () => {
        if (selectedLaps[0] && selectedLaps[1]) {
            const gap = selectedLaps[0].lap_duration - selectedLaps[1].lap_duration;
            const sign = gap < 0 ? '-' : '+';
            return `${sign}${Math.abs(gap).toFixed(3)}s`;
        }
        return null;
    };    

    const gap = calculateGap();

    return (
        <div>
            {qualifyingSessionKey ? (
                <>
                    <div className='flex gap-6'>
                        <div className='driver-1'>
                            <div className='flex'>
                                <div>
                                    {selectedDrivers[0] && (
                                        <img src={drivers.find(driver => driver.driver_number === Number(selectedDrivers[0]))?.headshot_url} alt="Driver Headshot" />
                                    )}
                                </div>
                                <label>
                                    <select className='text-gray-900' value={selectedDrivers[0]} onChange={(e) => handleDriverChange(0, e.target.value)}>
                                    <option value="">Select Driver</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.driver_number} value={driver.driver_number}>
                                                {driver.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div >
                                    {selectedDrivers[0] && (
                                        <img className='object-contain w-16 h-16' src={require(`../assets/Constructors Logo/${drivers.find(driver => driver.driver_number === Number(selectedDrivers[0]))?.team_name}.png`)} alt="Driver Team Logo" />
                                    )}
                                </div>
                            </div>
                            <div className='flex'>
                                <div>
                                    {selectedLaps[0] && (
                                        <h3 className='text-xl font-bold mb-2'>
                                            LAP {selectedLaps[0].lap_number}
                                        </h3>
                                    )}
                                    <label>
                                        <select className='text-gray-900' value={selectedLaps[0]?.lap_number} onChange={(e) => handleLapChange(0, e.target.value)}>
                                            <option value="">Select Lap</option>
                                            {laps[0]?.map((lap, lapIndex) => (
                                                <option key={lapIndex} value={lap.lap_number}>
                                                    {formatLapTime(lap.lap_duration)}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                {gap && (
                                    <div className="gap-section text-center">
                                        <h4 className='text-xl font-bold mb-2'>GAP</h4>
                                        <p className={`text-2xl font-semibold ${gap.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                                            {gap}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <SegmentsDivs selectedLap={selectedLaps[0]} />
                        </div>
                        {canRenderRaceTrack && (
                            <RaceTrack lapNumber={lapNumber} driverNumber={driverNumber} />
                        )}
                        <div className='driver-1'>
                            <div className='flex'>
                                <label>
                                    <select className='text-gray-900' value={selectedDrivers[1]} onChange={(e) => handleDriverChange(1, e.target.value)}>
                                    <option value="">Select Driver</option>
                                        {drivers.map((driver) => (
                                            <option key={driver.driver_number} value={driver.driver_number}>
                                                {driver.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div>
                                    {selectedDrivers[1] && (
                                        <img src={drivers.find(driver => driver.driver_number === Number(selectedDrivers[1]))?.headshot_url} alt="Driver Headshot" />                                    )}
                                </div>
                            </div>
                            <div>
                                <label>
                                    Select Lap for Driver 1:
                                    <select className='text-gray-900' value={selectedLaps[1]} onChange={(e) => handleLapChange(1, e.target.value)}>
                                        <option value="">Select a Lap</option>
                                        {laps[1]?.map((lap, lapIndex) => (
                                            <option key={lapIndex} value={lap.lap_number}>
                                                Lap {lap.lap_number} - {lap.lap_duration}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <p>Selected Lap for Driver 1: {selectedLaps[1]?.lap_number}</p>
                            </div>
                        </div>
                    </div>
                    <div className='relative w-full'>
                        {selectedLaps.map((lap, index) => lap && (
                            <div key={index} className='absolute top-0 left-0 w-2/5'>
                                {renderCharts(graphingData[index], index)}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CarData;