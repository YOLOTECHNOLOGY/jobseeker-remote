/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { IMContext } from 'components/Chat/IMProvider.client'
import dynamic from 'next/dynamic'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { useDispatch } from 'react-redux'
import CustomCard from 'components/Chat/customCard'
// import { updateDefaultChatList } from 'store/actions/chat/defaultChatList'
const JobseekerChat = dynamic<any>(import('components/Chat'), {
    ssr: false
})
// import JobseekerChat from 'components/Chat'
const Chat = () => {
    const router = useRouter()
    // const { query: { chat_id } } = router
    const {
        userId,
        imState,
        contextRef,
        loading,
        mobile,
        chatId,
        chatListLoading,
        isUnreadOn,
        setUnreadOn,
        chatList,
        filterMode,
        updateChatList,
        imStatus,
        interpreter,
        status,
        setStatus
    } = useContext(IMContext)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserOwnDetailRequest({}))
        dispatch(fetchConfigRequest())
    }, [])
    // const defaultChatList = useSelector((store: any) => store?.chat?.defaultChatList ?? [])
    const [chat_id, setChatId] = useState(router?.query?.chat_id)
    const [first, setFirst] = useState(true)


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
                setChatId(chatId)
            } else if (chat_id !== 'list') {
                history.replaceState(null, '', `/chat/${'list'}`)
                setChatId(chatId)
            }
        }
    }, [chatId])


    return <Layout isHiddenFooter isHiddenHeader={false}>
        <div style={{ marginTop: mobile ? 0 : 24 }}>
            <JobseekerChat
                key='jobchat'
                loading={loading}
                imState={imState}
                chatId={chatId || (chat_id === 'list' ? undefined : chat_id)}
                setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
                chatListLoading={chatListLoading}
                isUnreadOn={isUnreadOn}
                setUnreadOn={setUnreadOn}
                status={status}
                setStatus={setStatus}
                chatList={chatList}
                contextRef={contextRef}
                CustomCard={CustomCard}
                userId={userId}
                filterMode={filterMode}
                updateChatList={updateChatList}
                imStatus={imStatus}
                interpreter={interpreter}
            // businessInterpreters={interpreters}
            />
        </div>
    </Layout>
}
export const getServerSideProps = () => {
    return { props: {} }
}
export default Chat