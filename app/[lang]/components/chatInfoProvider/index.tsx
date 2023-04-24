'use client'
import { getCookie } from 'helpers/cookies'
import { check } from 'helpers/interpreters/services/chat'
import React, { createContext, useState, useEffect } from 'react'

export const ChatInfoContext = createContext({chatInfos:[]})

const ChatInfoProvider = (props: any) => {
    const { children, recruiterIds = [] } = props
    const [chatInfos, setChatInfos] = useState([])
    const accessToken = getCookie('accessToken')
    useEffect(() => {
        setChatInfos([])
        if (recruiterIds.length && accessToken) {
            check(recruiterIds.join(','), accessToken)
                .then(response => {
                    setChatInfos(response.data.data)
                })
        }
    }, [recruiterIds])
    return <ChatInfoContext.Provider
        value={{ chatInfos }}
    >
        {children}
    </ChatInfoContext.Provider>
}

export default ChatInfoProvider