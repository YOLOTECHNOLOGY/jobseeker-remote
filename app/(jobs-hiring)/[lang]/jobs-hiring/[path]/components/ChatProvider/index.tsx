'use client'
import { check } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { getCookie } from 'helpers/cookies'
import React, { createContext, useEffect, useState } from 'react'

export const ChatDataContext = createContext([])
const ChatDataProvider = (props: any) => {
    const { recruiterIds = [], children } = props
    const [data, setData] = useState([])
    useEffect(() => {
        const token = getCookie('accessToken')
        if (token && recruiterIds?.length) {
            check(recruiterIds, token.value)
                .then(response => {
                    const chats = response.data.data
                    setData(chats)
                })
        }
    }, [recruiterIds])

    return <ChatDataContext.Provider value={data ?? []}>
        {children}
    </ChatDataContext.Provider >
}

export default ChatDataProvider