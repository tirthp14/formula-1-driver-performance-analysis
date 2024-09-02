import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { formatLapTime } from '../utils/FormatTime';

const FastestLap = () => {
    const { raceSessionKey } = useContext(SessionContext);
    const [fastestLap, setFastestLap] = useState(null);
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        if (raceSessionKey) {
            const fetchFastestLap = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${raceSessionKey}`);
                    const data = await response.json();

                    const lapDurations = data.map(lap => lap.lap_duration).filter(duration => duration !== null);
                    const minLapDuration = Math.min(...lapDurations);
                    const fastestLapData = data.find(lap => lap.lap_duration === minLapDuration);

                    setFastestLap(fastestLapData);
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchFastestLap();
        }
    }, [raceSessionKey]);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            if (raceSessionKey) {
                const driverResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${raceSessionKey}`);
                const driverData = await driverResponse.json();
    
                setDrivers(driverData);
            }
        };

        fetchDriverDetails();
    }, [raceSessionKey]);

    if (!fastestLap) return null;

    const fastestLapDriver = drivers.find(driver => driver.driver_number === fastestLap.driver_number);

    const styleDriverName = (name) => {
        const [firstName, lastName] = name.split(' ');
        return (
            <p className="text-2xl font-extrabold">
                <span>{firstName} </span>
                <span style={{ color: `#${fastestLapDriver.team_colour}` }}>{lastName}</span>
            </p>
        );
    };

    return (
        <div className="max-w-md mx-auto bg-gray-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {fastestLapDriver && (
                <div className="flex items-center border-l-[5px]"
                     style={{ 
                         background: `#${fastestLapDriver.team_colour}33`,
                         borderColor: `#${fastestLapDriver.team_colour}CC` || "white"
                     }}>
                    <div className="p-2">
                        <img className='object-contain w-16 h-16' 
                            src={require(`../assets/Constructors Logo/${fastestLapDriver.team_name}.png`)} 
                            alt="Driver Team Logo" />
                    </div>
                    <div className="text-white">
                        {styleDriverName(fastestLapDriver.full_name)}
                        <div className="flex items-center">
                            <p className="text-lg">Lap {fastestLap.lap_number}</p>
                            <p className="text-3xl font-bold italic">{formatLapTime(fastestLap.lap_duration)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FastestLap;
