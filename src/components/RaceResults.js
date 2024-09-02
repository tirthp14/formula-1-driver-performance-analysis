import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import LapData from "../components/LapData";
import TyreStrategy from "../components/TyreStrategy";
import FastestLap from "../components/FastestLap";
import FastestPitstop from "../components/FastestPitstop";
import WindData from "../components/WindData";

const RaceResults = () => {
    const {raceSessionKey} = useContext(SessionContext);
    const [startingGrid, setStartingGrid] = useState([]);
    const [raceResults, setRaceResults] = useState([]);
    const [raceOrderDriverNumbers, setRaceOrderDriverNumbers] = useState([]);

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

                setStartingGrid(filteredStartingGrid);
                setRaceResults(filteredRaceResults);
                setRaceOrderDriverNumbers(raceOrderDriverNumbers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchRaceData();
    }, [raceSessionKey]);

    return (
        <div className="p-6 w-fit">
            <div className="flex space-x-10">
                <div className="space-y-10">
                    {/* Race Results Section */}
                    {raceResults.length > 0 && (
                        <div>
                            <div className="flex flex-row">
                                <div className="flex justify-center items-end mb-8">
                                    <div className="flex flex-col">
                                        <div className="flex justify-center items-center">
                                            <img src={raceResults[1].driverDetails.headshot_url} alt={raceResults[1].driverDetails.full_name} className="w-28 h-28 mt-2"/>
                                        </div>
                                        <div className="flex flex-col items-center justify-end bg-slate-800 text-white p-2 h-14 w-44 shadow-lg shadow-gray-400/10">
                                            <p className="text-2xl font-extrabold tracking-widest">P2</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex justify-center items-center">
                                            <img src={raceResults[0].driverDetails.headshot_url} alt={raceResults[0].driverDetails.full_name} className="w-32 h-32 mt-2"/>
                                        </div>
                                        <div className="flex flex-col items-center justify-end bg-slate-800 text-white p-2 h-20 w-44 shadow-lg shadow-gray-400/10 z-30">
                                            <p className="text-2xl font-extrabold tracking-widest">P1</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex justify-center items-center">
                                            <img src={raceResults[2].driverDetails.headshot_url} alt={raceResults[2].driverDetails.full_name} className="w-28 h-28 mt-2"/>
                                        </div>
                                        <div className="flex flex-col items-center justify-end bg-slate-800 text-white p-2 h-12 w-44 shadow-lg shadow-gray-400/10">
                                            <p className="text-2xl font-extrabold tracking-widest">P3</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-around space-x-4 mt-8">
                                    <div className="bg-gray-800 rounded-xl shadow-md w-64">
                                        <h3 className="text-xl font-bold text-yellow-400 mb-4">Fastest Lap</h3>
                                        <FastestLap />
                                    </div>
                                    <div className="bg-gray-800 p-5 rounded-xl shadow-md w-64">
                                        <h3 className="text-xl font-bold text-yellow-400 mb-4">Fastest Pitstop</h3>
                                        <FastestPitstop />
                                    </div>
                                    <div className="bg-gray-800 p-5 rounded-xl shadow-md w-64">
                                        <h3 className="text-xl font-bold text-yellow-400 mb-4">Wind Data</h3>
                                        <WindData />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 text-lg tracking-wide rounded-3xl p-5">
                                <table className="min-w-full text-white">
                                    <thead>
                                        <tr>
                                            <th className="pb-1 px-5 text-left text-gray-400">POS</th>
                                            <th className="pb-1 px-5 text-left text-gray-400">NAME</th>
                                            <th className="pb-1 px-5 text-left text-gray-400">TEAM</th>
                                            <th className="pb-1 px-5 text-left text-gray-400">GAP</th>
                                            <th className="pb-1 px-5 text-left text-gray-400">INT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {raceResults.map((driver, index) => (
                                            <tr key={index} className={`bg-opacity-50 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}`}>
                                                <td className="py-1 px-5 font-bold text-center">{driver.position}</td>
                                                <td className="py-1 pl-5 pr-12 tracking-wider font-bold border-l-[5px]" style={{ borderColor: driver.driverDetails.team_colour ? `#${driver.driverDetails.team_colour}` : "white"}}>{driver.driverDetails.broadcast_name}</td>
                                                <td className="py-1 px-5 font-semibold">{driver.driverDetails.team_name}</td>
                                                <td className="py-1 px-5 text-yellow-400">{driver.intervals?.gapToLeader || '--'}</td>
                                                <td className="py-1 px-5">{driver.intervals?.interval || '--'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <LapData raceOrderDriverNumbers={raceOrderDriverNumbers} />
                    <TyreStrategy raceResultsOrder={raceOrderDriverNumbers} />
                </div>

                <div>
                    {/* Qualifying Results Section */}
                    {startingGrid.length > 0 && (
                        <div className="p-5 bg-gray-800 rounded-3xl">
                            <div className="p-4 rounded-lg mb-5 border-[2px] border-slate-500">
                                <div className="flex justify-center space-x-2">
                                    <div className="w-7 h-7 bg-gray-700 rounded-full animate-light1"></div>
                                    <div className="w-7 h-7 bg-gray-700 rounded-full animate-light2"></div>
                                    <div className="w-7 h-7 bg-gray-700 rounded-full animate-light3"></div>
                                    <div className="w-7 h-7 bg-gray-700 rounded-full animate-light4"></div>
                                    <div className="w-7 h-7 bg-gray-700 rounded-full animate-light5"></div>
                                </div>
                            </div>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RaceResults;