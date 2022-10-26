import React, { useEffect, useMemo, useRef, useState } from 'react'
import { JobseekerChat, IMManager } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/sendResume'
import interpreter from 'helpers/interpreters'
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
const Chat = () => {
    const router = useRouter()
    const { query: { chat_id: chatId } } = router
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({} as any)
    const [chatList, setChatList] = useState([])

    useEffect(() => {
        list().then(result => {
            setChatList(result.data?.data?.chats)
        })
    }, [])
    const accessToken = getCookie('accessToken')
    const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
    const applicationId = useMemo(() => {
        return imState?.id ? `${imState.id}` : ''
    }, [imState])
    const dispatch = useDispatch()
    const applcationIdRef = useRef(applicationId)
    const stateRef = useRef(imState)
    const userDetailRef = useRef(userDetail)
    const chatIdRef = useRef(chatId)
    const userId = userDetail.id
    console.log('imState', imState)
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
                contextRef.current?.closeIssue?.()
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
            router.replace(`/chat/${chatId}`, null, { shallow: false, locale: false })
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
    return <Layout>
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
        <JobseekerChat
            loading={loading}
            imState={imState}
            chatId={chatId}
            chatList={chatList}
            contextRef={contextRef}

            businessInterpreters={interpreter}
        />

    </Layout>
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