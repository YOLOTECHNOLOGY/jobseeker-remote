'use client'
import { getCountryKey } from 'helpers/country';
import React from 'react';
import CountryProvider from './countryProvider';
const countryKey = getCountryKey() as any
const Provider = ({ children }: any) => {
    return <CountryProvider value={{ countryKey }}>
        {children}
    </CountryProvider>
}
export default Provider