'use client'
import React, { useContext } from 'react'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import Loading from './loading'
const Loader = (props: any) => {
    const { loading } = useContext(LoadingContext)
    const { children } = props
    return <>{loading ? <Loading/> : children}</>
}

export default Loader

