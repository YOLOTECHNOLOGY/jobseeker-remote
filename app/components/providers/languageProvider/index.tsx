'use client'
import React, { createContext, useContext } from 'react'
import json from '../../../../dictionaries/init_language.json'
export const languageContext = createContext<typeof json>(json)
const Provider = languageContext.Provider

const LanguageProvider = ({ children, store }: any) => {
  return <Provider value={store}>{children}</Provider>
}

export default LanguageProvider
export const useLanguage = () => {
  return useContext(languageContext);
}