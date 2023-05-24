/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Layout from 'components/Layout'
import { IMContext } from 'components/Chat/IMProvider.client'
import dynamic from 'next/dynamic'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { useDispatch, useSelector } from 'react-redux'
import CustomCard from 'components/Chat/customCard'
import { getDictionary } from 'get-dictionary'
// import { updateDefaultChatList } from 'store/actions/chat/defaultChatList'
const JobseekerChat = dynamic<any>(import('components/Chat'), {
    ssr: false
})
// import JobseekerChat from 'components/Chat'
const Chat = (props: any) => {
    const { langKey, lang } = props
    const router = useRouter()
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
        setStatus,
        translate
    } = useContext(IMContext)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserOwnDetailRequest({}))
        dispatch(fetchConfigRequest())
    }, [])
    // const defaultChatList = useSelector((store: any) => store?.chat?.defaultChatList ?? [])
    const [chat_id, setChatId] = useState(router?.query?.chat_id)
    const [first, setFirst] = useState(true)
    const statusOptions = useSelector((store: any) => store.config.config.response?.jobseeker_chat_type_filters?.map?.(item => {
        return {
            label: item.value,
            value: item.key
        }
    }))
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
                history.replaceState(null, '', '/' + langKey + `/chat/${chatId}`)
                setChatId(chatId)
            } else if (chat_id !== 'list') {
                history.replaceState(null, '', '/' + langKey + `/chat/${'list'}`)
                setChatId(chatId)
            }
        }
    }, [chatId])
    return <Layout isHiddenFooter isHiddenHeader={false} lang={lang}>
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
                statusOptions={statusOptions}
                filterMode={filterMode}
                updateChatList={updateChatList}
                imStatus={imStatus}
                interpreter={interpreter}
                translate={translate}
            // businessInterpreters={interpreters}
            />
        </div>
    </Layout>
}
export const getServerSideProps = async (props) => {
    const { query,params:{lang:langKey} } = props
    const lang = await getDictionary(query.lang as 'en-US')
    return {
        props: {
            lang, langKey
        }
    }
}
const Ready = (props) => {
    const { ready } = useContext(IMContext)
    if (ready) {
        return <Chat {...props} />
    } else {
        return <div />
    }
}
export default Ready