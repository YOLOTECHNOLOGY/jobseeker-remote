'use client'
import React from 'react'
import { wrapper } from 'store'
import { Provider } from 'react-redux'

const Providers = ({ children }: React.PropsWithChildren) => {
    const { store } = wrapper.useWrappedStore({})

    return <Provider store={store}>
        {children}
    </Provider>
}

export default Providers