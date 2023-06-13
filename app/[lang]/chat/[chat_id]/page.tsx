import React from 'react'
import Chat from './chat'
import { getDictionary } from 'get-dictionary'


const ChatPage = async (props: any) => {
    console.log({ props })
    const { params: { lang: langKey, chat_id } } = props
    const lang = await getDictionary(langKey as 'en-US')
    return <Chat lang={lang} langKey={langKey} chat_id={chat_id} />
}

export default ChatPage


