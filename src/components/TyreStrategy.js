import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';

const TyreStrategy = ({ driverCode, raceResultsOrder }) => {
    const { raceSessionKey } = useContext(SessionContext);
    const [drivers, setDrivers] = useState([]);
    const [maxLap, setMaxLap] = useState(0);

    useEffect(() => {
        const fetchStintData = async () => {
            try {
                const driverDetailsResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
                const driverDetailsData = await driverDetailsResponse.json();

                const response = await fetch(`https://api.openf1.org/v1/stints?session_key=${raceSessionKey}`);
                const data = await response.json();

                const groupedDrivers = data.reduce((acc, stint) => {
                    const { driver_number } = stint;
                    if (!acc[driver_number]) {
                        acc[driver_number] = {
                            driver_number,
                            acronym: driverDetailsData.find(d => d.driver_number === driver_number)?.name_acronym || driver_number.toString(),
                            tyres: []
                        };
                    }
                    acc[driver_number].tyres.push(stint);
                    return acc;
                }, {});

                const driversArray = Object.values(groupedDrivers);
                setDrivers(driversArray);

                const maxLapValue = Math.max(...data.map(stint => stint.lap_end));
                setMaxLap(maxLapValue);
                
                if (raceResultsOrder.length > 0) {
                    const sortedDrivers = raceResultsOrder.map(driverNumber =>
                        driversArray.find(driver => driver.driver_number === driverNumber)
                    ).filter(driver => driver);
                    setDrivers(sortedDrivers);
                }
            } catch (error) {
                console.error("Error fetching stint data:", error);
            }
        };

        if (raceSessionKey) {
            fetchStintData();
        }
    }, [raceSessionKey, raceResultsOrder]);

    if (!drivers.length) {
        return (
            <div className="flex relative justify-center">
                <img className='w-1/3 h-1/3 z-30' src={require('../assets/lotties/Loading Lottie.gif')} />
                <h className='absolute bottom-5 z-0 text-3xl font-bold animate-pulse tracking-wider'>Loading...</h>
            </div>
        );
    }

    const transformedData = drivers.map(driver => {
        const driverData = { acronym: driver.acronym };
        let previousLapEnd = 0;

        driver.tyres.forEach((tyre, index) => {
            const lapEndValue = index === 0 ? tyre.lap_end : tyre.lap_end - previousLapEnd;
            driverData[`${tyre.compound.toLowerCase()}${index}`] = lapEndValue;
            previousLapEnd = tyre.lap_end;
        });

        return driverData;
    });

    const tyreCompounds = {
        soft: '#e11d48',
        medium: '#fbbf24',
        hard: '#d3d3d3',
        intermediate: '#16a34a',
        wet: '#2563eb'
    };

    const tyreKeys = [
        ...new Set(transformedData.flatMap(Object.keys).filter(key => key !== 'acronym'))
    ];

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip text-white p-4 rounded-lg bg-gray-900 bg-opacity-80 backdrop-blur-sm z-[100] animate-slide-in drop-shadow-md">
                    <p className="font-extrabold tracking-wider text-xl">{label}</p>
                    <hr className="my-2 border-gray-600" />
                    {payload.map((entry, index) => (
                        <p className="font-semibold text-lg" key={index} style={{ color: tyreCompounds[entry.name.replace(/[0-9]/g, '')] }}>
                            {capitalizeFirstLetter(entry.name.replace(/[0-9]/g, ''))}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        
        return null;
    };

    return (
        <div>
            <div className="relative bg-gray-800 rounded-3xl p-4 shadow-lg">
                <p className="text-lg font-semibold mb-4 text-gray-200">Tyre Strategy</p>
                <ResponsiveContainer width="100%" height={driverCode ? 300 : 700}>
                    <BarChart
                        data={transformedData}
                        layout="vertical"
                        margin={{ right: 30, left: 10, top: 10, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                        <XAxis 
                            type="number"
                            domain={[0, maxLap]}
                            ticks={[...Array(maxLap + 1).keys()].filter(lap => lap % 10 === 0)}
                            tick={{ fill: '#a1a1aa', fontSize: 15, fontWeight: 'bold' }}
                        />
                        <YAxis 
                            dataKey="acronym"
                            type="category"
                            interval={0}
                            tick={{ fill: '#a1a1aa', fontSize: 15, fontWeight: 'bold' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }} />
                        {tyreKeys.sort((a, b) => {
                            const aNum = parseInt(a.match(/\d+$/)?.[0], 10);
                            const bNum = parseInt(b.match(/\d+$/)?.[0], 10);
                            return (aNum || 0) - (bNum || 0);
                        }).map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                fill={tyreCompounds[key.replace(/[0-9]/g, '')]}
                            >
                                <LabelList 
                                    dataKey={key}
                                    position="center"
                                    fill="white" 
                                    style={{ fontSize: 15, fontWeight: 'bold' }}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center mb-4">
                    <div className="flex items-center mr-6">
                        <div className="w-4 h-4 bg-[#e11d48] mr-2"></div>
                        <span className="text-gray-200">Soft</span>
                    </div>
                    <div className="flex items-center mr-6">
                        <div className="w-4 h-4 bg-[#fbbf24] mr-2"></div>
                        <span className="text-gray-200">Medium</span>
                    </div>
                    <div className="flex items-center mr-6">
                        <div className="w-4 h-4 bg-[#d3d3d3] mr-2"></div>
                        <span className="text-gray-200">Hard</span>
                    </div>
                    <div className="flex items-center mr-6">
                        <div className="w-4 h-4 bg-[#16a34a] mr-2"></div>
                        <span className="text-gray-200">Intermediate</span>
                    </div>
                    <div className="flex items-center mr-6">
                        <div className="w-4 h-4 bg-[#2563eb] mr-2"></div>
                        <span className="text-gray-200">Wet</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TyreStrategy;