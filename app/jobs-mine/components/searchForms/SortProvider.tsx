"use client"
import React, { useState, createContext } from 'react';
export const SortContext = createContext({ sort: '1', setSort: null, handleChange: null });
const Provider = SortContext.Provider

const SortProvider = ({ children }: any) => {

    const [sort, setSort] = useState('1')
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSort(newValue)
    }
    return <Provider value={{ sort, setSort, handleChange }}>
        {children}
    </Provider>

}

export default SortProvider;