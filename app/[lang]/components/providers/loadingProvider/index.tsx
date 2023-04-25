'use client'
import { useRouter } from 'next/navigation'
import React, { createContext, useTransition, useCallback } from 'react'

export const LoadingContext = createContext({ loading: false, push: a => a, refresh: () => undefined })
const Provider = LoadingContext.Provider

const LoadingProvider = ({ children, lang }: any) => {
    const router = useRouter()
    const [loading, startTransition] = useTransition()
    const push = useCallback((url) => {
        startTransition(() => {
            router.push(`${'en'}` + url, { forceOptimisticNavigation: false })
        })
    }, [router, startTransition])
    const refresh = useCallback(() => {
        startTransition(() => {
            router.refresh()
        })
    }, [router, startTransition])
    return <Provider value={{ loading, push, refresh }} >{children}</Provider>
}

export default LoadingProvider