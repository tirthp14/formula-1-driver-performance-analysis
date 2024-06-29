import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { fetchDriverDetails } from "../utils/DriverDetails";

const RaceResults = () => {
    const { sessionKey } = useContext(SessionContext);
    const [raceResults, setRaceResults] = useState([]);

    useEffect(() => {
        if (sessionKey) {
            const fetchRaceResults = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`);
                    const data = await response.json();

                    const raceResults = new Array(20).fill(null);

                    for (let i = data.length - 1; i >= 0; i--) {
                        const entry = data[i];
                        const position = entry.position;

                        if (position >= 1 && position <= 20 && !raceResults[position - 1]) {
                            const driverDetails = await fetchDriverDetails(entry.driver_number, sessionKey);
                            raceResults[position - 1] = { ...entry, driverDetails };
                        }
                    }

                    setRaceResults(raceResults.filter(entry => entry !== null));
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchRaceResults();
        }
    }, [sessionKey]);

    return (
        <div>
            This is the raceresults page, kinda!!
            {raceResults ? (
                <ol>
                    {raceResults.map((driver, index) => (
                        <li key={index}>
                            Driver Number: {driver.driver_number}, 
                            Name: {driver.driverDetails && driver.driverDetails.full_name ? driver.driverDetails.full_name : 'Loading...'}, 
                            Position: {driver.position}
                        </li>
                    ))}
                </ol>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RaceResults;
