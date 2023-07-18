'use client'
import { useRouter } from 'next/navigation'
import  { useEffect } from 'react'

const Redirect = (props: { url: string }) => {
    const router = useRouter()
    useEffect(() => {
        // @ts-ignore
        router.push(props.url, { forceOptimisticNavigation: true })
    }, [])
    return ''
}
export default Redirect