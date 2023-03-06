'use client'
import React from 'react'
import { wrapper } from './store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-next-router'
import { CookiesProvider } from 'react-cookie'
import { PersistGate } from 'redux-persist/integration/react'
import IMProvider from 'components/Chat/IMProvider.client'
import NotificationProvider from 'components/NotificationProvider'
import { persistor } from './store'
import MaintenancePage from 'pages/maintenance'

const Providers = ({ children }: React.PropsWithChildren) => {
    const { store } = wrapper.useWrappedStore({})

    return <Provider store={store}>
        <ConnectedRouter>
            <CookiesProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <IMProvider>
                        {process.env.MAINTENANCE === 'true' ? (
                            <MaintenancePage/>
                        )
                            : (
                                <NotificationProvider>
                                    {children}
                                </NotificationProvider>
                            )}
                    </IMProvider>
                </PersistGate>
            </CookiesProvider>
        </ConnectedRouter>

    </Provider>
}

export default Providers