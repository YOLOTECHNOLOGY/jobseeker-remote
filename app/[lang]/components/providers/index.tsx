"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { PersistGate } from 'redux-persist/integration/react'
import IMProvider from 'components/Chat/IMProvider.client'
import NotificationProvider from 'components/NotificationProvider'
import { persistor, wrapper } from '../../store'
import MaintenancePage from 'pages/[lang]/maintenance'
import LocationProvider from './locationProvier'
import CountryProvider from './countryProvider'
const ClientProviders = (props: any) => {
    const { children }: React.PropsWithChildren = props
    const { store } = wrapper.useWrappedStore({})
   console.log(props,'propss2233')
    return <Provider store={store}>
        <CountryProvider>
            <CookiesProvider>
                <LocationProvider>
                    <PersistGate loading={null} persistor={persistor}>
                        <IMProvider>
                            {process.env.MAINTENANCE === 'true' ? (
                                <MaintenancePage />
                            )
                                : (
                                    <NotificationProvider>
                                        {children}
                                    </NotificationProvider>
                                )}
                        </IMProvider>
                    </PersistGate>
                </LocationProvider>
            </CookiesProvider>
        </CountryProvider>
    </Provider>
}

export default ClientProviders