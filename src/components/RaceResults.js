import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const RaceResults = ({ setRaceResultsOrder }) => {
    const { raceSessionKey } = useContext(SessionContext);
    const [startingGrid, setStartingGrid] = useState([]);
    const [raceResults, setRaceResults] = useState([]);

    useEffect(() => {
        const fetchRaceData = async () => {
            try {
                const response = await fetch(`https://api.openf1.org/v1/position?session_key=${raceSessionKey}`);
                const data = await response.json();

                const driverDetailsResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
                const driverDetailsData = await driverDetailsResponse.json();

                const driverIntervalsResponse = await fetch(`https://api.openf1.org/v1/intervals?session_key=${raceSessionKey}`);
                const driverIntervalsResponseData = await driverIntervalsResponse.json();

                const driverDetailsMap = {};
                driverDetailsData.forEach(driver => {
                    driverDetailsMap[driver.driver_number] = driver;
                });

                const driverIntervalsMap = {};
                driverIntervalsResponseData.forEach(interval => {
                    const driverNumber = interval.driver_number;
                    if (!driverIntervalsMap[driverNumber] || new Date(interval.date) > new Date(driverIntervalsMap[driverNumber].date)) {
                        driverIntervalsMap[driverNumber] = {
                            interval: interval.interval,
                            gapToLeader: interval.gap_to_leader,
                            date: interval.date
                        }
                    }
                });

                const startingGridEntries = new Array(20).fill(null);
                const raceResultsEntries = new Array(20).fill(null);

                data.forEach(entry => {
                    const position = entry.position;
                    if (position >= 1 && position <= 20) {
                        if (!startingGridEntries[position - 1]) {
                            startingGridEntries[position - 1] = { ...entry, driverDetails: driverDetailsMap[entry.driver_number] };
                        }
                        raceResultsEntries[position - 1] = { 
                            ...entry, 
                            driverDetails: driverDetailsMap[entry.driver_number], 
                            intervals: driverIntervalsMap[entry.driver_number] || "N/A"
                        };
                    }
                });

                const filteredStartingGrid = startingGridEntries.filter(entry => entry !== null);
                const filteredRaceResults = raceResultsEntries.filter(entry => entry !== null);

                const raceOrderDriverNumbers = filteredRaceResults.map(entry => entry.driver_number);
                setRaceResultsOrder(raceOrderDriverNumbers);

                setStartingGrid(filteredStartingGrid);
                setRaceResults(filteredRaceResults);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchRaceData();
    }, [raceSessionKey, setRaceResultsOrder]);

    return (
        <div className="p-6 w-fit">
            <div className="flex space-x-10">
                {startingGrid.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 text-center w-fit">
                        {startingGrid.map((driver, index) => (
                            <div className="flex">
                                <div key={index} className={`relative ${index % 2 === 1 ? 'mt-5' : ''} text-3xl w-fit h-fit p-3 pt-1`}>
                                    {driver.driverDetails.name_acronym && driver.driverDetails.team_name ? (
                                        <div>
                                            <div className="absolute inset-0 border-2 border-b-0 border-gray-700" style={{ height: '25%' }}/>
                                            <img className="h-24 w-fit" src={require(`../assets/Constructors Cars/${driver.driverDetails.name_acronym} ${driver.driverDetails.team_name}.png`)} alt={`${driver.driverDetails.name_acronym} ${driver.driverDetails.team_name}`}/>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <p className="text-base text-gray-400 font-bold h-fit">P{index + 1}</p>
                                    <p className="text-lg font-bold h-fit">{driver.driverDetails.name_acronym}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Race Results Section */}
                {raceResults.length > 0 && (
                    <div>
                        <div className="flex justify-center items-end gap-4 mb-8">
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center mb-3">
                                    <img src={raceResults[1].driverDetails.headshot_url} alt={raceResults[1].driverDetails.full_name} className="w-24 h-24 mt-2"/>
                                </div>
                                <div className="flex flex-col items-center bg-gray-300 text-black p-4 rounded-lg">
                                    <p className="text-sm">P2</p>
                                    <p className="text-base font-bold mt-2">{raceResults[1].driverDetails.full_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center mb-3">
                                    <img src={raceResults[0].driverDetails.headshot_url} alt={raceResults[0].driverDetails.full_name} className="w-24 h-24 mt-2"/>
                                </div>
                                <div className="flex flex-col items-center bg-gray-300 text-black p-4 rounded-lg">
                                    <p className="text-sm">P1</p>
                                    <p className="text-base font-bold mt-2">{raceResults[0].driverDetails.full_name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-center items-center mb-3">
                                    <img src={raceResults[2].driverDetails.headshot_url} alt={raceResults[2].driverDetails.full_name} className="w-24 h-24 mt-2"/>
                                </div>
                                <div className="flex flex-col items-center bg-gray-300 text-black p-4 rounded-lg">
                                    <p className="text-sm">P3</p>
                                    <p className="text-base font-bold mt-2">{raceResults[2].driverDetails.full_name}</p>
                                </div>
                            </div>
                        </div>

                        <table className="min-w-full bg-gray-800 text-white mt-8">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="py-3 px-6 text-left">Position</th>
                                    <th className="py-3 px-6 text-left">Driver</th>
                                    <th className="py-3 px-6 text-left">Team</th>
                                    <th className="py-3 px-6 text-left">Interval</th>
                                </tr>
                            </thead>
                            <tbody>
                                {raceResults.slice(3).map((driver, index) => (
                                    <tr key={index} className={`border-b border-gray-600 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                        <td className="py-3 px-6">P{driver.position}</td>
                                        <td className="py-3 px-6">{driver.driverDetails.full_name}</td>
                                        <td className="py-3 px-6">{driver.driverDetails.team_name}</td>
                                        <td className="py-3 px-6">{driver.intervals?.interval || 'N/A'} seconds</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceResults;