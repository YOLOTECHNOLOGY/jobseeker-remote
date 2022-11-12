/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react'
import { JobseekerChat } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import interpreters from 'helpers/interpreters'
import { useRouter } from 'next/router'
import { wrapper } from 'store'
import Layout from 'components/Layout'
import styles from './index.module.scss'
import { IMContext } from 'components/Chat/IMProvider'
const Chat = () => {
    const router = useRouter()
    const { query: { chat_id } } = router
    const {
        userId,
        imState,
        contextRef,
        loading,
        chatList,
        mobile,
        chatId
    } = useContext(IMContext)
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
            console.log('chatId', chatId, chat_id)
            if (chatId) {
                history.replaceState(null, '', `/chat/${chatId}`)
                // router.replace(`/chat/${chatId}`, null, { shallow: true, locale: false })

            } else if (chat_id !== 'list') {
                history.replaceState(null, '', `/chat/${'list'}`)
                // router.replace(`/chat/${'list'}`, null, { shallow: true, locale: false })
            }
        }
    }, [chatId])

    // useEffect(() => {
    //     if (+chat_id !== +chatId) {
    //         if (chat_id === 'list') {
    //             if (chatId !== undefined) {
    //                 contextRef.current?.changeChat?.(undefined)
    //             }
    //         } else {
    //             contextRef.current?.changeChat?.(chat_id)
    //         }

    //     }
    // }, [chat_id])
    // useEffect(() => {
    //     if (+chatId !== +chat_id) {
    //         console.log('chatId', chatId, chat_id)
    //         if (chatId) {
    //             history.replaceState(null, '', `/chat/${chatId}`)
    //             // router.replace(`/chat/${chatId}`, null, { shallow: true, locale: false })

    //         } else if (chat_id !== 'list') {
    //             history.replaceState(null, '', `/chat/${'list'}`)
    //             // router.replace(`/chat/${'list'}`, null, { shallow: true, locale: false })
    //         }
    //     }
    // }, [chatId])

    return <Layout isHiddenFooter isHiddenHeader={mobile}>

        {!mobile &&
            <div className={styles.pcWeb}>
                <JobseekerChat
                    key='jobchat'
                    loading={loading}
                    imState={imState}
                    chatId={chatId}
                    setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
                    chatList={chatList}
                    contextRef={contextRef}
                    userId={userId}
                    businessInterpreters={interpreters}
                />
            </div>
        }
        {mobile && <div className={styles.mobile}>
            <JobseekerChat
                key='jobchat'
                loading={loading}
                imState={imState}
                chatId={chatId}
                setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
                chatList={chatList}
                contextRef={contextRef}
                userId={userId}
                businessInterpreters={interpreters}
            />
        </div>}
    </Layout>
}
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
    // const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

    // store.dispatch(fetchConfigRequest())
    // store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
    // store.dispatch(END)

    // await (store as any).sagaTask.toPromise()

    return {
        props: {}
    }
})
export default Chat