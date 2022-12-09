/* eslint-disable camelcase */
import React, { useContext, useEffect, useState, useMemo } from 'react'
import interpreters from 'helpers/interpreters'
import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import styles from './index.module.scss'
import { IMContext } from 'components/Chat/IMProvider'
import dynamic from 'next/dynamic'
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { END } from 'redux-saga'
import { list } from 'helpers/interpreters/services/chat'
import { isMobile } from 'react-device-detect'
const JobseekerChat = dynamic<any>(import('components/Chat'), {
    ssr: false
})
// import JobseekerChat from 'components/Chat'
const Chat = () => {
    const router = useRouter()
    const { query: { chat_id } } = router
    const {
        userId,
        imState,
        contextRef,
        loading,
        mobile,
        chatId
    } = useContext(IMContext)
    const [first, setFirst] = useState(true)
    const [chatList, setChatList] = useState([])
    const [chatListLoading, setChatListLoading] = useState(false)
    const [isUnreadOn, setUnreadOn] = useState(false)
    const [status, setStatus] = useState('')
    const searchParams = useMemo(() => {
        return {
            status,
            unread: isUnreadOn ? '1' : '0'
        }
    }, [isUnreadOn, status])
    useEffect(() => {
        if (!chatListLoading) {
            setChatListLoading(true)
            list(searchParams).then(result => {
                setChatList(result.data?.data?.chats)
            }).finally(() => setChatListLoading(false))
        }
    }, [searchParams])
    useEffect(() => {
        if (chat_id !== chatId) {
            if (chat_id === 'list') {
                if (chatId !== undefined) {
                    contextRef.current?.changeChat?.(undefined)
                }
            } else {
                contextRef.current?.changeChat?.(chat_id)
            }
        }
    }, [chat_id])
    useEffect(() => {
        if (first) {
            setFirst(false)
            return
        }
        if (chatId !== chat_id) {
            if (chatId) {
                history.replaceState(null, '', `/chat/${chatId}`)
            } else if (chat_id !== 'list') {
                history.replaceState(null, '', `/chat/${'list'}`)
            }
        }
    }, [chatId])
    return <Layout isHiddenFooter isHiddenHeader={mobile}>
        <div className={isMobile ? styles.mobile : styles.pcWeb}>
            <JobseekerChat
                key='jobchat'
                loading={loading}
                imState={imState}
                chatId={chatId}
                setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
                chatListLoading={chatListLoading}
                isUnreadOn={isUnreadOn}
                setUnreadOn={setUnreadOn}
                status={status}
                setStatus={setStatus}
                chatList={chatList}
                contextRef={contextRef}
                userId={userId}
                businessInterpreters={interpreters}
            />
        </div>
    </Layout>
}
export const getServerSideProps = wrapper.getServerSideProps(
    (store) =>
        async ({ req }) => {
            const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null
            // store actions
            store.dispatch(fetchConfigRequest())
            if (accessToken) {
                store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
            }
            store.dispatch(END)
            await (store as any).sagaTask.toPromise()
            return { props: {} }
        }
)
export default Chat