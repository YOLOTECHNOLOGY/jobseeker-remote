"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { PersistGate } from 'redux-persist/integration/react'
import NotificationProvider from 'components/NotificationProvider'
import { persistor, wrapper } from '../../models/store'
import MaintenancePage from 'app/maintenance/page'
import LocationProvider from './locationProvier'
import CountryProvider from './countryProvider'
import LoadingProvider from './loadingProvider'
import LanguageProvider from './languageProvider'
import LoginModalProvider from './loginModalProvider'
import { ProfileProvider } from './profileProvider'

import ContextComposer from './ContextComposer'

const VIf = props => props.show ? <>{props.children}</> : null

const ClientProviders = (props: any) => {
    const { children }: React.PropsWithChildren = props
    const { LG, lang }: any = props
    const { store } = wrapper.useWrappedStore({})
    return <Provider store={store} key={'MaintainerProvider'}>
        <VIf show={process.env.MAINTENANCE === 'true'}>
            <MaintenancePage />
        </VIf>

        <VIf show={process.env.MAINTENANCE !== 'true'}>
            <ContextComposer
                contexts={[
                    <CountryProvider key={'CountryProvider'} />,
                    <CookiesProvider key={'CookiesProvider'} />,
                    <LocationProvider key={'LocationProvider'} />,
                    <PersistGate loading={null} persistor={persistor} key={'PersistGate'} />,
                    <LanguageProvider store={LG} key={'LanguageProvider'} />,
                    <ProfileProvider key={'ProfileProvider'} />,
                    <NotificationProvider key={'NotificationProvider'} />,
                    <LoginModalProvider lang={lang} key={'LoginModalProvider'} />,
                    <LoadingProvider lang={lang} key={'LoadingProvider'} />,
                ]}
            >
                {children}
            </ContextComposer>
        </VIf>
    </Provider>
    // return <Provider store={store}>
    //     <CountryProvider>
    //         <CookiesProvider>
    //             <LocationProvider >
    //                 <PersistGate loading={null} persistor={persistor}>
    //                     <LanguageProvider store={LG}>
    //                         <ProfileProvider>
    //                             <IMProvider lang={lang}>
    //                                 {process.env.MAINTENANCE === 'true' ? (
    //                                     <MaintenancePage />
    //                                 )
    //                                     : (
    //                                         <NotificationProvider>
    //                                             <LoadingProvider lang={lang}>
    //                                                 <LoginModalProvider>
    //                                                     {children}
    //                                                 </LoginModalProvider>
    //                                             </LoadingProvider>
    //                                         </NotificationProvider>
    //                                     )}
    //                             </IMProvider>
    //                         </ProfileProvider>
    //                     </LanguageProvider>
    //                 </PersistGate>
    //             </LocationProvider>
    //         </CookiesProvider>
    //     </CountryProvider>
    // </Provider>
}

export default ClientProviders