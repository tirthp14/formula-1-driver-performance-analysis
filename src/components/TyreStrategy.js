import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';

const TyreStrategy = ({ driverCode, driverColor }) => {
    const { raceSessionKey } = useContext(SessionContext);
    const[drivers, setDrivers] = useState([]);
    const[maxLap, setMaxLap] = useState(0);

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

                const maxLap = Math.max(...data.map(stint => stint.lap_end));
                setMaxLap(maxLap);
            } catch (error) {
                console.log("Error fetching Stint data: ", error);
            }
        };

        if (raceSessionKey) {
            fetchStintData();
        }
    }, [raceSessionKey]);

    if (!drivers.length) {
        return <p>Loading Stint Data...</p>;
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

    const filteredTransformedData = driverCode
    ? transformedData.filter(driverData => driverData.acronym === driverCode)
    : transformedData;

    const tyreCompounds = {
        soft: '#e11d48',
        medium: '#fbbf24',
        hard: '#d3d3d3',
        intermediate: '#16a34a',
        wet: '#2563eb'
    };

    const tyreKeys = [
        ...new Set(filteredTransformedData.flatMap(Object.keys).filter(key => key !== 'acronym'))
    ]

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{backgroundColor: 'black'}}>
                <p className="font-display">{label}</p>
                <hr className="mb-4 mt-4"/>
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
        <>
            <h3 className="heading-4 mb-16 mt-32 text-neutral-400 ml-24">Tyre Strategy</h3>
            <div className="h-fit mb-16 relative rounded-xlarge bg-slate-900">
                <ResponsiveContainer width="60%" height={driverCode ? 100 : 700}>
                    <BarChart 
                        data={filteredTransformedData}
                        width="100%"
                        layout="vertical"
                        margin={{ right: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" width="100%"/>
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

                        {tyreKeys
                        .sort((a, b) => {
                            const aNum = parseInt(a.match(/\d+$/)[0], 10);
                            const bNum = parseInt(b.match(/\d+$/)[0], 10);
                            return aNum - bNum;
                        })
                        .map((key) => (
                            <Bar
                                className={`tyre-compound tyre-compound--${key.replace(/[0-9]/g, '')}`}
                                dataKey={key}
                                key={key}
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
        </>
    );
};

export default TyreStrategy;