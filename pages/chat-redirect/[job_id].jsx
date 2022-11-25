/* eslint-disable camelcase */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { createChat } from 'helpers/interpreters/services/chat'

const Chat = () => {
    const router = useRouter()
    const { query: { job_id } } = router
    useEffect(() => {
        createChat(job_id).then(result => {
            const chatId = result.data.data.id
            router.push(`/chat/${chatId}`)
        }).catch(() => {
            router.push(`/`)
        })
    }, [])
    return <Layout loading={true}/>
}
export const getServerSideProps = () => {
    return {
        props: {}
    }
}
export default Chat