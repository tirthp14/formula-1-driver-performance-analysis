import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";
import { calculateAvgWindDirection, calculateAvgWindSpeed, calculateAvgAirTemp, calculateAvgTrackTemp } from "../utils/WindDirectionFormatting"

const WindData = () => {
    const {raceSessionKey} = useContext(SessionContext)
    const [avgWindDirection, setAvgWindDirection] = useState(null);
    const [avgWindSpeed, setAvgWindSpeed] = useState(null);
    const [avgAirTemp, setAvgAirTemp] = useState(null);
    const [avgTrackTemp, setAvgTrackTemp] = useState(null);

    useEffect(() => {
        if (raceSessionKey) {
            const fetchWindData = async () => {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/weather?session_key=${raceSessionKey}`)

                    const data = await response.json();

                    const direction = data.map(item => item.wind_direction);
                    const speed = data.map(item => item.wind_speed);
                    const airTemp = data.map(item => item.air_temperature);
                    const trackTemp = data.map(item => item.track_temperature);
                    
                    const avgDirection = calculateAvgWindDirection(direction);
                    const avgSpeed = calculateAvgWindSpeed(speed);
                    const avgTemp = calculateAvgAirTemp(airTemp);
                    const avgTrackTemp = calculateAvgTrackTemp(trackTemp);
                    
                    setAvgWindDirection(avgDirection);
                    setAvgWindSpeed(avgSpeed);
                    setAvgAirTemp(avgTemp);
                    setAvgTrackTemp(avgTrackTemp)
                } catch (error) {
                    console.log("Error fetching Data: ", error);
                }
            };
            fetchWindData();
        }
    }, [raceSessionKey]);

    return (
        <div>
            {avgWindDirection !== null && avgWindSpeed !== null && avgAirTemp !== null && avgTrackTemp !== null ? (
                <div>
                    <p>Average Wind Direction: {avgWindDirection}</p>
                    <p>Average Wind Speed: {avgWindSpeed.toFixed(2)} m/s</p>
                    <p>Average Temperature: {avgAirTemp.toFixed(0)} °C</p>
                    <p>Average Track Temperature: {avgTrackTemp.toFixed(0)} °C</p>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    )
}

export default WindData;