"use client"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import React, { useState, createContext } from 'react';

export const SortContext = createContext({ sort: '1', handleChange: null });

const Provider = SortContext.Provider

const SortProvider = ({ children }: any) => {
    const params = useSearchParams()
    const sort = params.get('sort')
    // const [sort, setSort] = useState('2')
    const router = useRouter()
    const pairs = []
    for (const p of params.entries()) {
        pairs.push(p)
    }
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        const newParams = new URLSearchParams(pairs)
        newParams.set('sort', newValue)
        const url = location.pathname + '/?' + newParams.toString()
        router.push(url)
    }

    return <Provider value={{ sort, handleChange }}>
        {children}
    </Provider>

}

export default SortProvider;