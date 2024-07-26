import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const RaceTrack = ({lapNumber, driverNumber}) => {
    const { qualifyingSessionKey } = useContext(SessionContext);
    const [lapData, setLapData] = useState(null);
    const [trackData, setTrackData] = useState(null);

    useEffect(() => {
        const fetchTrackCoordinates = async () => {
            if (qualifyingSessionKey && driverNumber && lapNumber) {
                try {
                    const response = await fetch(`https://api.openf1.org/v1/laps?session_key=${qualifyingSessionKey}&driver_number=${driverNumber}&lap_number=${lapNumber}`);
                    const lapData = await response.json();

                    setLapData(lapData)    
                } catch (error) {
                    console.log("Error fetching location data: ", error);
                }
            }
        }

        fetchTrackCoordinates();
    }, [qualifyingSessionKey, driverNumber, lapNumber]);

    useEffect(() => {
        if (lapData) {
            processData(lapData[0].date_start, lapData[0].lap_duration);
        }

    }, [lapData]);

    const fetchTrackData = async (qualifyingSessionKey, driverNumber) => {
        const response = await fetch(`https://api.openf1.org/v1/location?session_key=${qualifyingSessionKey}&driver_number=${driverNumber}`);
        const data = await response.json();

        return data;
    }

    const processData = async (dateStart, lapDuration) => {
        try {
            const data = await fetchTrackData(qualifyingSessionKey, driverNumber)

            const startTime = new Date(dateStart).getTime();
            const endTime = startTime + lapDuration * 1000;

            const startIndex = findClosestIndex(data, startTime);
            const endIndex = findClosestIndex(data, endTime);

            setTrackData(data.slice(startIndex, endIndex + 1));

            console.log(trackData)
        } catch (error) {
            console.log("Error fetching Graph Data: ", error);
        }
    }
    
    const findClosestIndex = (data, targetTime) => {
        return data.reduce((closestIndex, entry, index) => {
            const entryTime = new Date(entry.date).getTime();
            const diff = Math.abs(entryTime - targetTime);
            return diff < Math.abs(new Date(data[closestIndex].date).getTime() - targetTime) ? index : closestIndex;
        }, 0)
    }
}

export default RaceTrack;