'use client'
import { useRouter } from 'next/navigation'
import React, { createContext, useTransition, useCallback } from 'react'
import Loading from 'app/[lang]/loading'
export const LinkContext = createContext({ loading: false, push: a => a, refresh: () => undefined })
const Provider = LinkContext.Provider

const LinkProvider = ({ children }: any) => {
    const router = useRouter()
    const [loading, startTransition] = useTransition()
    console.log({ linkLoading: loading })
    const push = useCallback((url) => {
        startTransition(() => {
            router.push(url, { forceOptimisticNavigation: false })
        })
    }, [router, startTransition])
    const refresh = useCallback(() => {
        startTransition(() => {
            router.refresh()
        })
    }, [router, startTransition])
    return <Provider value={{ loading, push, refresh }} >{loading ? <Loading /> : children}</Provider>
}

export default LinkProvider