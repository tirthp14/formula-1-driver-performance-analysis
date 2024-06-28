import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const StartingGrid = () => {
    const {sessionKey} = useContext(SessionContext);
    const [startingGrid, setStartingGrid] = useState(null);

    useEffect(() => {
        if (sessionKey) {
            const fetchGridPosition = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`);

                    const data = await response.json();

                    const grid = getStartingGrid(data)
                    setStartingGrid(grid)
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchGridPosition();
        }
    }, [sessionKey]);

    return (
        <div>
            This is the startingrid page, kinda!!
            {startingGrid ? (
                <ol>
                    {startingGrid.map((driver, index) => (
                        <li key={index}>Driver Number: {driver.driver_number}, Position: {driver.position}</li>
                    ))}
                </ol>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

const getStartingGrid = (data) => {
    const startingGrid = new Array(20).fill(null);

    for (const entry of data) {
        const position = entry.position

        if (position >= 1 && position <=20 && !startingGrid[position - 1]) {
            startingGrid[position - 1] = entry
        }
    }

    return startingGrid.filter(entry => entry !== null)
};

export default StartingGrid;