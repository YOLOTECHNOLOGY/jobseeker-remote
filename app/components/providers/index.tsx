"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { PersistGate } from 'redux-persist/integration/react'
import IMProvider from 'components/Chat/IMProvider.client'
import NotificationProvider from 'components/NotificationProvider'
import { persistor, wrapper } from '../../store'
import MaintenancePage from 'pages/maintenance'
import LocationProvider from './locationProvier'
const ClientProviders = ({ children }: React.PropsWithChildren) => {
    const { store } = wrapper.useWrappedStore({})

    return <Provider store={store}>
        <CookiesProvider>
            <LocationProvider>
                {/* <PersistGate loading={null} persistor={persistor}> */}
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
                {/* </PersistGate> */}
            </LocationProvider>
        </CookiesProvider>
    </Provider>
}

export default ClientProviders