import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { fetchDriverDetails } from "../utils/DriverDetails";

const StartingGrid = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [startingGrid, setStartingGrid] = useState([]);

    useEffect(() => {
        if (qualifyingSessionKey) {
            const fetchGridPosition = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/position?session_key=${qualifyingSessionKey}`);
                    const data = await response.json();

                    const startingGrid = new Array(20).fill(null);

                    for (let i = data.length - 1; i >= 0; i--) {
                        const entry = data[i];
                        const position = entry.position;

                        if (position >= 1 && position <= 20 && !startingGrid[position - 1]) {
                            const driverDetails = await fetchDriverDetails(entry.driver_number, qualifyingSessionKey);
                            startingGrid[position - 1] = { ...entry, driverDetails };
                        }
                    }

                    setStartingGrid(startingGrid.filter(entry => entry !== null));
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchGridPosition();
        }
    }, [qualifyingSessionKey]);

    return (
        <div>
            {startingGrid ? (
                <ol className="text-white">
                    {startingGrid.map((driver, index) => (
                        <li key={index}>
                            Driver Number: {driver.driver_number}, 
                            Name: {driver.driverDetails ? driver.driverDetails.full_name : 'Unknown'}, 
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

export default StartingGrid;
