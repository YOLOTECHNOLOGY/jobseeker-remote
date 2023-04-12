'use client'
import React, { createContext } from 'react';

export const CountryContext = createContext({ countryKey: '' })
const CountryProvider = ({ children,value }: any) => {
   
    return <CountryContext.Provider value={value}>
        {children}
    </CountryContext.Provider>
}
export default CountryProvider