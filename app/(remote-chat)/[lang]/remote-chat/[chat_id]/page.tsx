'use client'
import { useSharedData } from 'bossjob-remote/dist/clientStorage'
import { useEffect } from 'react'
const Page = () => {
    // const { lang } = props.params
    const chatId = useSharedData('CHAT_ID')
    useEffect(() => {
        const path = +chatId ? chatId : 'list'
        history.replaceState(null, '', `${path}`)
    }, [chatId])

    return (
        <>
        </>
    );
}
export default Page