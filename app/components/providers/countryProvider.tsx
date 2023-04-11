import { getCountryKey } from 'helpers/country';
import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchConfigRequest } from 'store/actions/config/fetchConfig';

export const CountryContext = createContext({ countryKey: '' })
const countryKey = getCountryKey() as any
const CountryProvider = ({ children }: any) => {
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(fetchConfigRequest())
    }, [])
    return <CountryContext.Provider value={countryKey}>
        {children}
    </CountryContext.Provider>
}
export default CountryProvider