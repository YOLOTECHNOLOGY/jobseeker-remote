'use client'
import React, {createContext} from 'react'
export const languageContext = createContext({ lang: {}})
const Provider = languageContext.Provider

const LanguageProvider = ({ children, store }: any) => {
    return <Provider value={store} >{children}</Provider>
}

export default LanguageProvider