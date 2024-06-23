import { useContext, useState } from "react";
import { SessionContext } from "../utils/SessionContext";

const SelectRace = () => {
    const [country, setCountry] = useState('');
    const [year, setYear] = useState('');
    const [session, setSession] = useState('');
    const { setSessionKey } = useContext(SessionContext);

    const fetchSessionKey = async () => {
        try {
            const response = await fetch(`https://api.openf1.org/v1/sessions?country_name=${country}&session_name=${session}&year=${year}`)

            const data = await response.json()

            if (data.length > 0 && data[0].session_key) {
                setSessionKey(data[0].session_key);
                console.log('Session Key:', data[0].session_key); //This needs to be removed after done
            } else {
                console.log('No sessions found for the given criteria.');
            }            
        } catch (error) {
            console.log("Error fetching the data: ", error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSessionKey();
    }
    
    return (
        <form onSubmit={handleSubmit} className="text-white p-5">
            <div className="py-4">
                <label>
                    Country:
                    <input className="text-black bg-gray-400" type="text" value={country} onChange={(e) => setCountry(e.target.value)} required/>
                </label>
            </div>
            <div className="py-4">
                <label>
                    Year:
                    <input className="text-black bg-gray-400" type="number" value={year} onChange={(e) => setYear(e.target.value)} required/>
                </label>
            </div>
            <div className="py-4">
                <label>
                    Session:
                    <input className="text-black bg-gray-400" type="text" value={session} onChange={(e) => setSession(e.target.value)} required/>
                </label>
            </div>
            <button type="submit" className="bg-blue-500">Submit</button>
        </form>
    );
};

export default SelectRace;