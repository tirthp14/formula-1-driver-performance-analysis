import { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({children}) => {
    const [raceSessionKey, setRaceSessionKey] = useState(null);
    const [qualifyingSessionKey, setQualifyingSessionKey] = useState(null);

    return (
        <SessionContext.Provider value={{raceSessionKey, setRaceSessionKey, qualifyingSessionKey, setQualifyingSessionKey}}>
            {children}
        </SessionContext.Provider>
    );
};