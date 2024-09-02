import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { calculateAvgWindDirection, calculateAvgWindSpeed, calculateAvgAirTemp, calculateAvgTrackTemp, calculateAvgHumidity } from "../utils/WindDirectionFormatting";

const WindData = () => {
    const {raceSessionKey} = useContext(SessionContext);
    const [avgWindDirection, setAvgWindDirection] = useState(null);
    const [avgWindSpeed, setAvgWindSpeed] = useState(null);
    const [avgAirTemp, setAvgAirTemp] = useState(null);
    const [avgTrackTemp, setAvgTrackTemp] = useState(null);
    const [avgHumidity, setAvgHumidity] = useState(null);

    useEffect(() => {
        if (raceSessionKey) {
            const fetchWindData = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/weather?session_key=${raceSessionKey}`);
                    const data = await response.json();

                    const direction = data.map(item => item.wind_direction);
                    const speed = data.map(item => item.wind_speed);
                    const airTemp = data.map(item => item.air_temperature);
                    const trackTemp = data.map(item => item.track_temperature);
                    const humidity = data.map(item => item.humidity);

                    const avgDirection = calculateAvgWindDirection(direction);
                    const avgSpeed = calculateAvgWindSpeed(speed);
                    const avgTemp = calculateAvgAirTemp(airTemp);
                    const avgTrackTemp = calculateAvgTrackTemp(trackTemp);
                    const avgHumidity = calculateAvgHumidity(humidity);

                    setAvgWindDirection(avgDirection);
                    setAvgWindSpeed(avgSpeed);
                    setAvgAirTemp(avgTemp);
                    setAvgTrackTemp(avgTrackTemp);
                    setAvgHumidity(avgHumidity);
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchWindData();
        }
    }, [raceSessionKey]);

    return (
        <div className="flex items-center justify-center mr-5">
            {avgWindDirection !== null && avgWindSpeed !== null && avgAirTemp !== null && avgTrackTemp !== null ? (
                <div className="flex flex-row space-x-8">
                    <div className="text-left flex flex-col items-center justify-center">
                        <div className="w-full">
                            <p className="text-left text-xl font-semibold text-gray-300">Wind</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{avgWindSpeed.toFixed(1)} km/h {avgWindDirection} ➚</p>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-center justify-center">
                        <div className="w-full">
                            <p className="text-left text-xl font-semibold text-gray-300">Air</p>
                        </div>
                        <div className="w-full">
                            <p className="text-left text-2xl font-bold">{avgAirTemp.toFixed(1)} °C</p>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-center justify-center">
                        <div className="w-full">
                            <p className="text-left text-xl font-semibold text-gray-300">Track</p>
                        </div>
                        <div className="w-full">
                            <p className="text-left text-2xl font-bold">{avgTrackTemp.toFixed(1)} °C</p>
                        </div>
                    </div>
                    <div className="text-left flex flex-col items-center justify-center">
                        <div className="w-full">
                            <p className="text-left text-xl font-semibold text-gray-300">Humidity</p>
                        </div>
                        <div className="w-full">
                            <p className="text-left text-2xl font-bold">{avgHumidity.toFixed(1)} %</p>
                        </div>
                    </div>
                </div>
            ) : (
                null
            )}
        </div>
    );
}

export default WindData;
