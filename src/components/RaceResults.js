import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const RaceResults = () => {
    const {sessionKey} = useContext(SessionContext);
    const [raceResults, setRaceResults] = useState(null);

    useEffect(() => {
        if (sessionKey) {
            const fetchRaceResults = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`);

                    const data = await response.json();

                    const results = getRaceResults(data)
                    setRaceResults(results)
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
                        <li key={index}>Driver Number: {driver.driver_number}, Position: {driver.position}</li>
                    ))}
                </ol>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

const getRaceResults = (data) => {
    const raceResults = new Array(20).fill(null);

    for (let i = data.length - 1; i >=0; i--) {
        const entry = data[i]
        const position = entry.position

        if (position >= 1 && position <= 20 && !raceResults[position - 1]) {
            raceResults[position - 1] = entry
        }
    }

    return raceResults.filter(entry => entry !== null);
};

export default RaceResults;