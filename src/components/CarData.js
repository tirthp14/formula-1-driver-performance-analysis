import React, { useContext, useState, useEffect, useCallback } from 'react';
import RaceTrack from './RaceTrack';
import { formatLapTime } from '../utils/FormatTime';
import SegmentsDivs from './SectorTimes';
import { getOppositeColor } from '../utils/Color';
import { SessionContext } from "../utils/SessionContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const CarData = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [laps, setLaps] = useState([[], []]);
    const [selectedLaps, setSelectedLaps] = useState([null, null]);
    const [graphingData, setGraphingData] = useState([[], []]);
    const [lapNumber, setLapNumber] = useState("");
    const [driverNumber, setDriverNumber] = useState("");

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
    }, [laps, setLapNumber, setDriverNumber, selectedDrivers]);

    const getTeamColor = (index) => {
        if (selectedLaps[0] && selectedLaps[1]) {
            const driver = drivers.find(driver => driver.driver_number === Number(selectedDrivers[index]));
            return `#${driver.team_colour}`;
        }
    }

    const renderCharts = useCallback((data, driverIndex) => {
        const driverColor = driverIndex === 0 ? getTeamColor(0) : getOppositeColor(getTeamColor(1));
    
        return ["speed", "brake", "throttle", "rpm", "drs", "n_gear"].map((key) => (
            <div key={key} className='relative'>
                <ResponsiveContainer fill="gray" width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid fillOpacity={0.1} strokeDasharray="0" stroke="#ccc" strokeOpacity={0.1} />
                        <XAxis tick={false} />
                        <YAxis label={{ value: `${key.charAt(0).toUpperCase() + key.slice(1).toUpperCase()}`, angle: -90, position: 'insideLeft' }} tick={{ fill: '#fff' }} />
                        <Line type="monotone" dataKey={key} stroke={driverColor} dot={false} strokeWidth={1.5} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        ));
    }, [getTeamColor, getOppositeColor]);
    

    const canRenderRaceTrack = selectedDrivers[0] && selectedDrivers[1] && selectedLaps[0] && selectedLaps[1];

    const calculateGaps = () => {
        if (selectedLaps[0] && selectedLaps[1]) {
            const lapDuration1 = selectedLaps[0].lap_duration;
            const lapDuration2 = selectedLaps[1].lap_duration;
    
            // Calculate gaps
            const gap1 = lapDuration1 - lapDuration2;
            const gap2 = lapDuration2 - lapDuration1;
    
            // Determine which driver is faster and format gaps
            const gapDriver1 = gap1 < 0 ? `-${Math.abs(gap1).toFixed(3)}s` : `+${Math.abs(gap1).toFixed(3)}s`;
            const gapDriver2 = gap2 < 0 ? `-${Math.abs(gap2).toFixed(3)}s` : `+${Math.abs(gap2).toFixed(3)}s`;
    
            return [gapDriver1, gapDriver2];
        }
        return [null, null];
    };
    
    const [gapDriver1, gapDriver2] = calculateGaps();

    return (
        <div>
            {qualifyingSessionKey ? (
                <>
                    <hr className="h-[3px] border-0 bg-lineBackground"></hr>
                    <div className='w-full h-fit flex gap-8'>
                        <div className='max-w-full driver-1 flex flex-col gap-4 pt-2'>
                            <div>
                                <h1 className='mb-1 text-xs'>DRIVER</h1>
                                <div className='border-l-[5px]' style={{ backgroundColor: selectedLaps[0] ? getTeamColor(0) + '1A' : "rgba(255, 255, 255, 0.2)", borderColor: selectedLaps[0] ? getTeamColor(0) : "white"}}>
                                    <div className='flex justify-between items-center p-2'>
                                        <div>
                                            {selectedDrivers[0] && (
                                                <img className='w-16 h-16' src={drivers.find(driver => driver.driver_number === Number(selectedDrivers[0]))?.headshot_url} alt="Driver Headshot" />
                                            )}
                                        </div>
                                        <label>
                                            <select className='bg-transparent text-2xl' value={selectedDrivers[0]} onChange={(e) => handleDriverChange(0, e.target.value)}>
                                            <option className='bg-gray-500 text-base' value="">Select Driver</option>
                                                {drivers.map((driver) => (
                                                    <option className='bg-gray-500 text-base' key={driver.driver_number} value={driver.driver_number}>
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
                                </div>
                            </div>
                            <div className='flex justify-between items-center mt-2'>
                                {selectedLaps[0] && (
                                    <div>
                                        <h4 className='mb-2 text-xs'>LAP NUMBER</h4>
                                        <p className='text-xl font-bold'>
                                            {selectedLaps[0].lap_number}
                                        </p>
                                    </div>
                                )}
                                <label>
                                    <h4 className='mb-2 text-xs'>LAP TIME</h4>
                                    <select className='text-gray-900' value={selectedLaps[0]?.lap_number} onChange={(e) => handleLapChange(0, e.target.value)}>
                                        <option value="">Select Lap</option>
                                        {laps[0]?.map((lap, lapIndex) => (
                                            <option key={lapIndex} value={lap.lap_number}>
                                                {formatLapTime(lap.lap_duration)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                {gapDriver1 && (
                                    <div className="gap-section">
                                        <h4 className='mb-2 text-xs'>GAP</h4>
                                        <p className={`text-2xl font-semibold ${gapDriver1.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                                            {gapDriver1}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {selectedLaps[0] && (
                                <SegmentsDivs selectedLap={selectedLaps[0]} />
                            )}
                        </div>
                        {canRenderRaceTrack && (
                            <RaceTrack lapNumber={lapNumber} driverNumber={driverNumber} />
                        )}
                        <div className='w-max driver-2 flex flex-col gap-4 pt-2'>
                            <div>
                                <h1 className='mb-1'>DRIVER</h1>
                                <div className='border-l-[5px]' style={{ backgroundColor: selectedLaps[1] ? getOppositeColor(getTeamColor(1))+ '1A' : "rgba(255, 255, 255, 0.2)", borderColor: selectedLaps[1] ? getOppositeColor(getTeamColor(1)) : "white"}}>
                                    <div className='flex justify-between p-2'>
                                        <div>
                                            {selectedDrivers[1] && (
                                                <img className='w-16 h-16' src={drivers.find(driver => driver.driver_number === Number(selectedDrivers[1]))?.headshot_url} alt="Driver Headshot" />
                                            )}
                                        </div>
                                        <label>
                                            <select className='bg-transparent' value={selectedDrivers[1]} onChange={(e) => handleDriverChange(1, e.target.value)}>
                                            <option className='bg-gray-500' value="">Select Driver</option>
                                                {drivers.map((driver) => (
                                                    <option className='bg-gray-500' key={driver.driver_number} value={driver.driver_number}>
                                                        {driver.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <div >
                                            {selectedDrivers[1] && (
                                                <img className='object-contain w-16 h-16' src={require(`../assets/Constructors Logo/${drivers.find(driver => driver.driver_number === Number(selectedDrivers[1]))?.team_name}.png`)} alt="Driver Team Logo" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-between mt-2'>
                                {selectedLaps[1] && (
                                    <div>
                                        <h4 className='text-xl font-bold mb-2'>LAP NUMBER</h4>
                                        <p className='text-xl font-bold'>
                                            {selectedLaps[1].lap_number}
                                        </p>
                                    </div>
                                )}
                                <label>
                                    <h4 className='text-xl font-bold mb-2'>LAP TIME</h4>
                                    <select className='text-gray-900' value={selectedLaps[1]?.lap_number} onChange={(e) => handleLapChange(1, e.target.value)}>
                                        <option value="">Select Lap</option>
                                        {laps[1]?.map((lap, lapIndex) => (
                                            <option key={lapIndex} value={lap.lap_number}>
                                                {formatLapTime(lap.lap_duration)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                {gapDriver2 && (
                                    <div className="gap-section text-center">
                                        <h4 className='text-xl font-bold mb-2'>GAP</h4>
                                        <p className={`text-2xl font-semibold ${gapDriver2.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                                            {gapDriver2}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {selectedLaps[1] && (
                                <SegmentsDivs selectedLap={selectedLaps[1]} />
                            )}
                        </div>
                    </div>
                    <div className='relative w-full h-96'>
                        {selectedLaps.map((lap, index) => lap && (
                            <div key={index} className='absolute top-0 left-0 w-2/5'>
                                {renderCharts(graphingData[index], index)}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <img className='w-1/3 h-1/3' src={require('../assets/lotties/Loading Lottie.gif')} />
            )}
        </div>
    );
};

export default CarData;