"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { PersistGate } from 'redux-persist/integration/react'
import IMProvider from 'app/[lang]/chat/[chat_id]/components/IMProvider.client'
import NotificationProvider from 'components/NotificationProvider'
import { persistor, wrapper } from '../../store'
import MaintenancePage from 'pages/[lang]/maintenance'
import LocationProvider from './locationProvier'
import CountryProvider from './countryProvider'
import LoadingProvider from './loadingProvider'
import LanguageProvider from './languageProvider'
const ClientProviders = (props: any) => {
    const { children }: React.PropsWithChildren = props
    const { LG ,lang}: any = props
    const { store } = wrapper.useWrappedStore({})
    return <Provider store={store}>
        <CountryProvider>
            <CookiesProvider>
                <LocationProvider lang={LG}>
                    <PersistGate loading={null} persistor={persistor}>
                        <LanguageProvider store={LG}>
                            <IMProvider lang={lang}>
                                {process.env.MAINTENANCE === 'true' ? (
                                    <MaintenancePage />
                                )
                                    : (
                                        <NotificationProvider>
                                            <LoadingProvider lang={lang}>
                                                {children}
                                            </LoadingProvider>
                                        </NotificationProvider>
                                    )}
                            </IMProvider>
                        </LanguageProvider>
                    </PersistGate>
                </LocationProvider>
            </CookiesProvider>
        </CountryProvider>
    </Provider>
}

export default ClientProviders