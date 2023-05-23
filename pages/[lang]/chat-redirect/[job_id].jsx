/* eslint-disable camelcase */
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'
import { useSelector } from 'react-redux'
import { wrapper } from 'store'
import { END } from '@redux-saga/core'


import Layout from 'components/Layout'
import { createChat } from 'helpers/interpreters/services/chat'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

const Chat = () => {
    const router = useRouter()
    const { query: { job_id, source } } = router
    const userDetail = useSelector(store => store.users.fetchUserOwnDetail?.response ?? {})
    const userId = userDetail.id
    useEffect(() => {
        if (userId) {
            createChat(job_id, { source, job_title_id: null, device: isMobile ? 'mobile_web' : 'web' }).then(result => {
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