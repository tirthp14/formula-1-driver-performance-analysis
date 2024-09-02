import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const FastestPitstop = () => {
    const { raceSessionKey } = useContext(SessionContext);
    const [fastestPit, setFastestPitstop] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [fastestPitDriver, setFastestPitDriver] = useState(null);

    useEffect(() => {
        if (raceSessionKey) {
            const fetchFastestPitstop = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/pit?session_key=${raceSessionKey}`);
                    const data = await response.json();

                    const pitDurations = data.map((pit) => pit.pit_duration).filter((duration) => duration !== null);
                    const minPitDuration = Math.min(...pitDurations);
                    const fastestPitData = data.find((pit) => pit.pit_duration === minPitDuration);

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

    useEffect(() => {
        if (fastestPit && drivers.length > 0) {
            const driver = drivers.find((driver) => driver.driver_number === fastestPit.driver_number);
            setFastestPitDriver(driver);
        }
    }, [fastestPit, drivers]);

    if (!fastestPit || !fastestPitDriver) return null;

    return (
        <div>
            <div className="max-w-md mx-auto shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <div
                    className="flex items-center justify-between border-r-[5px] h-24 px-2"
                    style={{
                        background: `#${fastestPitDriver?.team_colour || "FFFFFF"}1A`,
                        borderColor: `#${fastestPitDriver?.team_colour || "FFFFFF"}CC`,
                    }}
                >
                    <div className="p-2">
                        <p className="text-2xl font-extrabold tracking-wide mb-2">
                            {fastestPitDriver.team_name}
                        </p>
                        {fastestPitDriver.team_name ? (
                            <img
                                className="object-contain w-56"
                                src={require(`../assets/Constructors Cars Side Profile/${fastestPitDriver.team_name}.png`)}
                                alt="Driver Team Logo"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-700 flex items-center justify-center text-white">No Image</div>
                        )}
                    </div>
                    <div className="text-white pr-2">
                        <div className="flex flex-col items-center">
                            <p className="text-xl mb-1.5">Lap {fastestPit.lap_number}</p>
                            <p className="text-3xl font-bold">{fastestPit.pit_duration}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FastestPitstop;
