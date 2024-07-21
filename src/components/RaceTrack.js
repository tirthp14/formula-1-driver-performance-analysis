import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const RaceTrack = () => {
    const { qualifyingSessionKey } = useContext(SessionContext);

    useEffect(() => {
        const fetchTrackCoordinates = async () => {
            try {
                const response = await fetch(`https://api.openf1.org/v1/location?session_key=${qualifyingSessionKey}`);
                const data = await response.json();
            } catch (error) {
                console.log("Error fetching location data: ", error);
            }
        }

        fetchTrackCoordinates();
    })
}

export default RaceTrack;