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
            {startingGrid.length > 0 && (
                <div className="grid grid-cols-2 gap-3 text-center w-fit">
                    {startingGrid.map((driver, index) => (
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
                    ))}
                </div>
            )}

            {/* Race Results Section */}
            {raceResults.length > 0 ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Race Results</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        {raceResults.map((driver, index) => (
                            <li key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                <p><strong>Driver Number:</strong> {driver.driver_number}</p>
                                <p><strong>Name:</strong> {driver.driverDetails?.full_name || 'Loading...'}</p>
                                <p><strong>Position:</strong> {driver.position}</p>
                                {driver.intervals ? (
                                    <>
                                        <p><strong>Interval:</strong> {driver.intervals.interval} seconds</p>
                                        <p><strong>Gap to Leader:</strong> {driver.intervals.gapToLeader} seconds</p>
                                    </>
                                ) : <p><strong>Interval:</strong> N/A</p>}
                            </li>
                        ))}
                    </ol>
                </div>
            ) : (
                <p className="text-gray-500">No Race Results Available</p>
            )}
        </div>
    );
};

export default RaceResults;