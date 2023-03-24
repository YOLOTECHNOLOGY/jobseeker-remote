'use client'
import { useRouter } from 'next/navigation'
import React, { createContext, useTransition, useCallback } from 'react'

export const LoadingContext = createContext({ loading: false, push: a => a })
const Provider = LoadingContext.Provider

const LoadingProvider = ({ children }: any) => {
    const router = useRouter()
    const [loading, startTransition] = useTransition()
    const push = useCallback((url) => {
        startTransition(() => {
            router.push(url, { forceOptimisticNavigation: true })
        })
    }, [router, startTransition])
    return <Provider value={{ loading, push }} >{children}</Provider>
}

export default LoadingProvider