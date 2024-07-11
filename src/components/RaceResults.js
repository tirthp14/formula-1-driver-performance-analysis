import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const RaceResults = () => {
    const { raceSessionKey } = useContext(SessionContext);
    const [startingGrid, setStartingGrid] = useState([]);
    const [raceResults, setRaceResults] = useState([]);

    useEffect(() => {
        const fetchRaceData = async () => {
            try {
                

                // Fetch race positions
                const response = await fetch(`https://api.openf1.org/v1/position?session_key=${raceSessionKey}`);
                const data = await response.json();

                // Fetch all driver details
                const driverDetailsResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
                const driverDetailsData = await driverDetailsResponse.json();

                // Map driver details to an object for quick lookup
                const driverDetailsMap = {};
                driverDetailsData.forEach(driver => {
                    driverDetailsMap[driver.driver_number] = driver;
                });

                // Initialize arrays for starting grid and race results
                const startingGridEntries = new Array(20).fill(null);
                const raceResultsEntries = new Array(20).fill(null);

                // Process race positions to get starting grid and race results
                data.forEach(entry => {
                    const position = entry.position;
                    if (position >= 1 && position <= 20) {
                        if (!startingGridEntries[position - 1]) {
                            startingGridEntries[position - 1] = { ...entry, driverDetails: driverDetailsMap[entry.driver_number] };
                        }
                        raceResultsEntries[position - 1] = { ...entry, driverDetails: driverDetailsMap[entry.driver_number] };
                    }
                });

                // Filter out null entries (positions with no driver) for both starting grid and race results
                const filteredStartingGrid = startingGridEntries.filter(entry => entry !== null);
                const filteredRaceResults = raceResultsEntries.filter(entry => entry !== null);

                setStartingGrid(filteredStartingGrid);
                setRaceResults(filteredRaceResults);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRaceData();
    }, [raceSessionKey]);

    return (
        <div>
            {startingGrid.length > 0 && (
                <div>
                    <p>Starting Grid:</p>
                    <ol>
                        {startingGrid.map((driver, index) => (
                            <li key={index}>
                                Driver Number: {driver.driver_number}, 
                                Name: {driver.driverDetails?.full_name || 'Loading...'}, 
                                Position: {driver.position}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {raceResults.length > 0 ? (
                <div>
                    <p>Race Results:</p>
                    <ol>
                        {raceResults.map((driver, index) => (
                            <li key={index}>
                                Driver Number: {driver.driver_number}, 
                                Name: {driver.driverDetails?.full_name || 'Loading...'}, 
                                Position: {driver.position}
                            </li>
                        ))}
                    </ol>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RaceResults;
