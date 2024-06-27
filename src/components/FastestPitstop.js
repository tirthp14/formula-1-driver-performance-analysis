import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const FastestPitstop = () => {
    const {sessionKey} = useContext(SessionContext)
    const [fastestPit, setFastestPitstop] = useState(null);

    useEffect(() => {
        if (sessionKey) {
            const fetchFastestPitstop = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/pit?session_key=${sessionKey}`)

                    const data = await response.json();

                    const pitDurations = data.map(pit => pit.pit_duration).filter(duration => duration !== null);
                    const minPitDuration = Math.min(...pitDurations)
                    const fastestPitData = data.find(pit => pit.pit_duration === minPitDuration);

                    setFastestPitstop(fastestPitData);
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchFastestPitstop();
        }
    }, [sessionKey]);

    return (
        <div>
            This is the fastestpit page, kinda!!
            {fastestPit && (
                <div>
                    <p>Driver Number: {fastestPit.driver_number}</p>
                    <p>Lap Number: {fastestPit.lap_number}</p>
                    <p>Lap Duration: {fastestPit.pit_duration}</p>
                </div>
            )}
        </div>
    )
}

export default FastestPitstop;