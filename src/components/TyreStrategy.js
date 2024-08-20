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
                    ).filter(driver => driver); // Ensure no undefined drivers
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
        return  <div className="flex relative justify-center">
                    <img className='w-1/3 h-1/3 z-50' src={require('../assets/lotties/Loading Lottie.gif')} />
                    <h className='absolute bottom-5 z-0 text-3xl font-bold animate-pulse tracking-wider'>Loading...</h>
                </div>
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
                <div className="custom-tooltip bg-black text-white p-2 rounded">
                    <p className="font-bold">{label}</p>
                    <hr className="my-2" />
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: tyreCompounds[entry.name.replace(/[0-9]/g, '')] }}>
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
            <h3 className="text-2xl font-bold mb-8 text-neutral-400">Tyre Strategy</h3>
            <div className="relative p-4">
                <ResponsiveContainer width="100%" height={driverCode ? 300 : 700}>
                    <BarChart
                        data={transformedData}
                        layout="vertical"
                        margin={{ right: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            type="number"
                            domain={[0, maxLap]}
                            ticks={[...Array(maxLap + 1).keys()].filter(lap => lap % 10 === 0)}
                        />
                        <YAxis 
                            dataKey="acronym"
                            type="category"
                            interval={0}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'grey' }} />
                        {tyreKeys.sort((a, b) => {
                            const aNum = parseInt(a.match(/\d+$/)?.[0], 10);
                            const bNum = parseInt(b.match(/\d+$/)?.[0], 10);
                            return (aNum || 0) - (bNum || 0);
                        }).map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId="a"
                                stroke={tyreCompounds[key.replace(/[0-9]/g, '')]}
                                fill={tyreCompounds[key.replace(/[0-9]/g, '')]}
                            >
                                <LabelList 
                                    dataKey={key}
                                    position="center"
                                    fill="black" 
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TyreStrategy;