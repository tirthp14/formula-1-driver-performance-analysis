export const fetchSessionKey = async (country, session, year) => {
    try {
        const response = await fetch(`https://api.openf1.org/v1/sessions?country_name=${country}&session_name=${session}&year=${year}`);
        const data = await response.json();

        if (data.length > 0 && data[0].session_key) {
            return data[0].session_key;
        } else {
            console.log("No sessions found for the given criteria.");
            return null;
        }
    } catch (error) {
        console.log("Error fetching session key: ", error)
        return null;
    }
};