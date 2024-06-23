import { createContext, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({children}) => {
    const [sessionKey, setSessionKey] = useState(null);

    return (
        <SessionContext.Provider value={{sessionKey, setSessionKey}}>
            {children}
        </SessionContext.Provider>
    );
};