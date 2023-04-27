/* eslint-disable prefer-promise-reject-errors */
'use client'
import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react'
import { ReaderTPromise as M } from 'app/abstractModels/monads'
import { registInterpreter } from 'app/abstractModels/util'
import { locationScript } from 'app/abstractModels/updateLocation'
import { getLocation } from 'store/services/location'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { flatMap } from 'lodash-es'
import { getCookie } from 'helpers/cookies'
import { useRouter } from 'next/navigation'
import {getCountryKey} from 'helpers/country'
const countryList = {
    "ph":{
        "id": 63,
        "key": "manila",
        "value": "Manila",
        "is_popular": false,
        "region_display_name": "National Capital Region",
        "seo_value": "manila"
    },
    "sg":{
        id: 165,
        is_popular:  false,
        key: "downtown_core",
        region_display_name: "Central",
        seo_value: "downtown-core",
        value: "Downtown Core",
    }
 };
 

export const LocationContext = createContext()
const Provider = LocationContext.Provider

// eslint-disable-next-line react/prop-types
const LocationProvider = ({ children }) => {
    const country = getCountryKey();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchConfigRequest())
    }, [])
    const locations = useSelector(store => store.config?.config?.response?.location_lists)
    const router = useRouter()
    const flatLocations = useMemo(() => {
        if (!locations?.length) {
            return []
        }
        return flatMap(locations, p => p.locations)
    }, [locations])
    const defaultLocation = getCookie('location') ?? countryList[country]
    const [location, setLocation] = useState(defaultLocation)
    const intepreter = useCallback(command => command.cata({
        queryLatLon: () => M(() => new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords
                resolve({ latitude, longitude })
            },
                error => {
                    reject(error)
                }
            )
        })),

        fetchLocation: position => M.do(() => {
            return getLocation(position).then(result => {
                const city = result?.data?.data?.city
                const country = result?.data?.data?.country
                if (!city) {
                    return Promise.reject('not find location')
                } else {
                    return { city, country }
                }
            })
        }),
        updateLocation: location => M.do(() => {
            const newLocation = flatLocations.find(item => item.value === location.city)
            if (newLocation && newLocation.value !== location?.value) {
                setLocation(newLocation)
            }
        }),
    }), [location, flatLocations, router])
    const locationIp = registInterpreter(intepreter)
    const [locationUpdated, setLocationupdated] = useState(false)
    useEffect(() => {
        if (flatLocations?.length && !locationUpdated && !getCookie('location')) {
            locationIp(locationScript())
                .run()
            setLocationupdated(true)
        }
    }, [flatLocations, locationUpdated])
    return <Provider value={{ location, setLocation }}>{children}</Provider>
}
export default LocationProvider