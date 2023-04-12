'use client'
import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchConfigRequest } from 'store/actions/config/fetchConfig';

export const CountryContext = createContext({ countryKey: '' })
const CountryProvider = ({ children,value }: any) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigRequest())
    }, [])
    return <CountryContext.Provider value={value}>
        {children}
    </CountryContext.Provider>
}
export default CountryProvider