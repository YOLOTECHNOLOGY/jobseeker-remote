/* eslint-disable camelcase */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { createChat } from 'helpers/interpreters/services/chat'
import { useSelector } from 'react-redux'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { wrapper } from 'store'
import { END } from '@redux-saga/core'

const Chat = () => {
    const router = useRouter()
    const { query: { job_id, source } } = router
    console.log({ router })
    const userDetail = useSelector(store => store.users.fetchUserOwnDetail?.response ?? {})
    const userId = userDetail.id
    useEffect(() => {
        if (userId) {
            createChat(job_id, { source }).then(result => {
                const chatId = result.data.data.id
                router.push(`/chat/${chatId}`)
            }).catch(() => {
                router.push(`/`)
            })
        } else {
            router.push(`/`)
        }
    }, [userId])
    return <Layout loading={true} />
}
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
    const accessToken = req.cookies?.accessToken ?? null
    store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
    store.dispatch(END)
    await store.sagaTask.toPromise()
    return {
        props: {}
    }
})
export default Chat