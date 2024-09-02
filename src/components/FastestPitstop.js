import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { formatLapTime } from '../utils/FormatTime';

const FastestPitstop = () => {
    const {raceSessionKey} = useContext(SessionContext)
    const [fastestPit, setFastestPitstop] = useState(null);
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        if (raceSessionKey) {
            const fetchFastestPitstop = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/pit?session_key=${raceSessionKey}`)

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

    if (!fastestPit) return null;

    const fastestPitDriver = drivers.find(driver => driver.driver_number === fastestPit.driver_number);

    return (
        <div>
            {fastestPit && (
                <div>
                    <div className="max-w-md mx-auto bg-gray-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
                        <div className="flex items-center border-r-[5px]"
                            style={{ 
                                background: `#${fastestPitDriver.team_colour}33`,
                                borderColor: `#${fastestPitDriver.team_colour}` || "white"
                            }}>
                            <div className="p-2">
                                <img className='object-contain w-16 h-16' 
                                    src={require(`../assets/Constructors Cars Side Profile/${fastestPitDriver.team_name}.png`)}
                                    alt="Driver Team Logo" />
                            </div>
                            <div className="text-white">
                                <div className="flex items-center">
                                    <p className="text-lg">Lap {fastestPit.lap_number}</p>
                                    <p className="text-3xl font-bold italic">{fastestPit.pit_duration}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Driver Number: {fastestPit.driver_number}</p>
                        <p>Lap Number: {fastestPit.lap_number}</p>
                        <p>Lap Duration: {fastestPit.pit_duration}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FastestPitstop;