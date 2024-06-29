export const fetchDriverDetails = async (driverNumber, sessionKey) => {
    try {
        const response = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}&driver_number=${driverNumber}`);
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.log("Error fetching driver details: ", error);
        return null;
    }
};