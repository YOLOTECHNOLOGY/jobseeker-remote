'use client'
import React, { createContext, useState } from 'react'

export const LocationContext = createContext()
const Provider = LocationContext.Provider

// eslint-disable-next-line react/prop-types
const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        "id": 63,
        "key": "manila",
        "value": "Manila",
        "is_popular": false,
        "region_display_name": "National Capital Region",
        "seo_value": "manila"
    })
    return <Provider value={{ location, setLocation }}>{children}</Provider>
}
export default LocationProvider