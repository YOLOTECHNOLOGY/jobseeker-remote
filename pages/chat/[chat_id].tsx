/* eslint-disable camelcase */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { JobseekerChat, IMManager } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/sendResume'
import interpreters from 'helpers/interpreters'
import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useRouter } from 'next/router'
import Interview from 'components/Chat/interview'
import NotInterestModal from 'components/Chat/notInterest'
import { getCookie } from 'helpers/cookies'
import ExchangeModal from 'components/Chat/exchange'
import { wrapper } from 'store'
import { fetchConfigRequest } from 'store/actions/config/fetchConfig'
import { END } from 'redux-saga'
import CancelDetailModal from 'components/Chat/interview/cancelDetail'
import CancelModal from 'components/Chat/interview/cancel'
import IssueModal from 'components/Chat/interview/issue'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { getAuth } from 'helpers/interpreters/services/chat'
import { list } from 'helpers/interpreters/services/chat'
import Layout from 'components/Layout'
import CommonPhrases from 'components/Chat/commonPhrases'
import styles from './index.module.scss'
const Chat = () => {
    const router = useRouter()
    const { query: { chat_id } } = router

    const chatId = (!chat_id || chat_id === 'list') ? null : chat_id
    const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
    const userDetailRef = useRef(userDetail)
    const userId = userDetail.id
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({} as any)
    const [chatList, setChatList] = useState([])
    const [mobile, setMobile] = useState(false)
    useEffect(() => {
        const old: any = window.onresize
        setMobile(document.body.clientWidth < 992)
        window.onresize = (...args) => {
            old?.(...args)
            setMobile( document.body.clientWidth < 992)
            // const newMoble = document.body.clientWidth < 992
            // if (mobile !== newMoble) {
            //     setMobile(newMoble)
                
            //     console.log('onResize', newMoble,mobile)
            // }

        }
        return () => window.onresize = old
    }, [])
    useEffect(() => {
        list().then(result => {
            setChatList(result.data?.data?.chats)
        })
    }, [])
    const accessToken = getCookie('accessToken')
    const applicationId = useMemo(() => {
        return imState?.id ? `${imState.id}` : ''
    }, [imState])
    const dispatch = useDispatch()
    const applcationIdRef = useRef(applicationId)
    const stateRef = useRef(imState)
    const chatIdRef = useRef(chatId)
    useEffect(() => {
        if (userId) {
            IMManager.accessUser('' + userId, userId => getAuth(userId).then(result => {
                return result.data?.data?.authcode
            }))
        }
    }, [userId])
    useEffect(() => {
        chatIdRef.current = chatId
    }, [chatId])
    useEffect(() => {
        applcationIdRef.current = applicationId
    }, [applicationId])
    useEffect(() => {
        stateRef.current = imState
    }, [imState])
    useEffect(() => {
        userDetailRef.current = userDetail
    }, [userDetail])

    const contextRef = useRef({
        setLoading,
        hideModals() {
            contextRef.current?.closeSendResume?.()
            contextRef.current?.closeConfirm?.()
            contextRef.current?.closeAccept?.()
            contextRef.current?.closeDetail?.()
            contextRef.current?.closeNotInterest?.()
            contextRef.current?.closeExchange?.()
            contextRef.current?.closeCancelDetail?.(),
                contextRef.current?.closeCancel?.(),
                contextRef.current?.closeIssue?.(),
                contextRef.current.closeEditCommonPhrasesList?.()
            contextRef.current.closeCommonPhrases?.()
            contextRef.current.closeEditOneCommonPhrases?.()
            contextRef.current.closeCreateOneCommonPhrases?.()
            contextRef.current.closeDeleteOneCommonPhrases?.()
        },
        updateUser() {
            dispatch(fetchUserOwnDetailRequest({ accessToken }))
        },
        handleError(e) {
            console.log('error', e)
        },
        handleFinish(type) {
            console.log('finish', type)
        },
        isUserNumberValidate() {
            return userDetailRef.current?.phone_num
        },
        updateData(data) {
            console.log('update', data?.data?.job_application)
            setImState(data?.data?.job_application)
        },
        getChatId() {
            return chatIdRef.current
        },
        getApplicationId() {
            return applcationIdRef.current
        },
        getState() {
            return stateRef.current
        },
        changeChat(chatId) {
            console.log('onChangeChat', chatId)
            // history.replaceState(null,null,`/chat/${chatId}`)
            if (chatId) {
                router.replace(`/chat/${chatId}`, null, { shallow: true, locale: false })

            } else {
                router.replace(`/chat/${'list'}`, null, { shallow: true, locale: false })
            }
        },
        showToast(type, content) {
            dispatch(
                displayNotification({
                    open: true,
                    message: content,
                    severity: type
                })
            )
        }
    } as any)
    // const chat = <JobseekerChat
    //     loading={loading}
    //     imState={imState}
    //     chatId={chatId}
    //     setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
    //     chatList={chatList}
    //     contextRef={contextRef}
    //     userId={userId}
    //     businessInterpreters={interpreters}
    // />
    return <>
        <SendResumeModal
            loading={loading}
            contextRef={contextRef}
            data={imState.resume_request}
            applicationId={applicationId}
        />
        <Interview
            loading={loading}
            contextRef={contextRef}
            data={imState.interview}
            applicationId={applicationId}
        />
        <ExchangeModal
            loading={loading}
            contextRef={contextRef}
            applicationId={applicationId}
        />
        <NotInterestModal
            loading={loading}
            data={imState}
            applicationId={applicationId}
            contextRef={contextRef}
        />
        <IssueModal
            loading={loading}
            data={imState?.interview}
            applicationId={applicationId}
            contextRef={contextRef}
        />
        <CancelModal
            loading={loading}
            data={imState?.interview}
            applicationId={applicationId}
            contextRef={contextRef}
        />
        <CancelDetailModal
            loading={loading}
            data={imState?.interview}
            applicationId={applicationId}
            contextRef={contextRef}
        />
        <CommonPhrases
            loading={loading}
            data={imState?.interview}
            applicationId={applicationId}
            contextRef={contextRef}
        />
        {!mobile && <Layout isHiddenFooter className={styles.pcWeb}>
            <JobseekerChat
                loading={loading}
                imState={imState}
                chatId={chatId}
                setChatId={chatId => contextRef.current?.changeChat?.(chatId)}
                chatList={chatList}
                contextRef={contextRef}
                userId={userId}
                businessInterpreters={interpreters}
            />
        </Layout>}
        {mobile && <div className={styles.mobile}>
            <JobseekerChat
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
    </>
}
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
    const accessToken = req.cookies?.accessToken ? req.cookies.accessToken : null

    store.dispatch(fetchConfigRequest())
    store.dispatch(fetchUserOwnDetailRequest({ accessToken }))
    store.dispatch(END)

    await (store as any).sagaTask.toPromise()

    return {
        props: {}
    }
})
export default Chat