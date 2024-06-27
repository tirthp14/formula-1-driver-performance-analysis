import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const FastestLap = () => {
    const {sessionKey} = useContext(SessionContext)
    const [fastestLap, setFastestLap] = useState(null);

    useEffect(() => {
        if (sessionKey) {
            const fetchFastestLap = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`);

                    const data = await response.json();

                    const lapDurations = data.map(lap => lap.lap_duration).filter(duration => duration !== null);
                    const minLapDuration = Math.min(...lapDurations)
                    const fastestLapData = data.find(lap => lap.lap_duration === minLapDuration);

                    setFastestLap(fastestLapData);
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchFastestLap();
        }
    }, [sessionKey]);

    return (
        <div>
            This is the fastestlap page, kinda!!
            {fastestLap && (
                <div>
                    <p>Driver Number: {fastestLap.driver_number}</p>
                    <p>Lap Number: {fastestLap.lap_number}</p>
                    <p>Lap Duration: {fastestLap.lap_duration}</p>
                    <p>Sector 1 Duration: {fastestLap.duration_sector_1}</p>
                    <p>Sector 2 Duration: {fastestLap.duration_sector_2}</p>
                    <p>Sector 3 Duration: {fastestLap.duration_sector_3}</p>
                </div>
            )}
        </div>
    )
}

export default FastestLap;