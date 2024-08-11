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
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default StartingGrid;
