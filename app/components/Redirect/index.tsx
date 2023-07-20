'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Redirect = (props: { url: string }) => {
    const router = useRouter()
    useEffect(() => {
        router.push(props.url, { scroll: true })
    }, [])
    return ''
}
export default Redirect