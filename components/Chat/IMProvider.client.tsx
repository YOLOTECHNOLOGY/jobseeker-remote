import React, { createContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { IMManager, hooks } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/sendResume'
import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import Interview from 'components/Chat/interview'
import NotInterestModal from 'components/Chat/notInterest'
import { getCookie } from 'helpers/cookies'
import ExchangeModal from 'components/Chat/exchange'
import CancelDetailModal from 'components/Chat/interview/cancelDetail'
import CancelModal from 'components/Chat/interview/cancel'
import IssueModal from 'components/Chat/interview/issue'
import { fetchUserOwnDetailRequest, fetchUserOwnDetailSetMobileVerified } from 'store/actions/users/fetchUserOwnDetail'
import { getAuth } from 'helpers/interpreters/services/chat'
import { userInfo } from 'helpers/interpreters/services/userInfo'
import CommonPhrases from 'components/Chat/commonPhrases'
import ViewJobModal from './viewJob'
import ExchangeConfirmModal from './exchange/confirm'
import { updateImState } from 'store/actions/chat/imState'
import { list } from 'helpers/interpreters/services/chat'
import NotificationContainer, { usePushNotification } from './notificationContainer'
import ExchangeDetailModal from './exchange/detail'
import interpreters from 'helpers/interpreters'
import { useRouter } from 'next/router'
import errorParser from 'helpers/errorParser'
import { pushNotification } from 'store/services/notification'
export const IMContext = createContext<any>({})
const Provider = IMContext.Provider
const IMProvider = ({ children }: any) => {
    useEffect(() => {
        if (window.SharedWorker) {
            (window as any).imSharedWorker.port.onmessage = () => {
                console.log('refreshMessage')
                IMManager.refreshMessages()
            }
        }
    }, [])
    const [chatId, setChatId] = useState()
    const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})

    const userDetailRef = useRef(userDetail)
    const userId = useMemo(() => {
        return userDetail.id
    }, [userDetail])

    const [loading, setLoading] = useState(false)
    const imStateMap = useSelector((store: any) => store?.chat?.imState ?? {})
    const imState = useMemo(() => {
        return chatId ? imStateMap?.[chatId] ?? {} : {}
    }, [imStateMap, chatId])
    const imStateMapRef = useRef(imStateMap)
    useEffect(() => {
        imStateMapRef.current = imStateMap
    }, [imStateMap])
    const [mobile, setMobile] = useState(false)
    const [totalUnread, setTotalUnread] = useState(0)
    useEffect(() => {
        const updateMobile = () => {
            setMobile(document.body.clientWidth < 576)
        }
        updateMobile()
        window.addEventListener("resize", updateMobile);

        return () => {
            window.removeEventListener("resize", updateMobile)
        }
    }, [])
    const accessToken = getCookie('accessToken')
    const applicationId = useMemo(() => {
        return imState?.id ? `${imState.id}` : ''
    }, [imState])
    const dispatch = useDispatch()
    const applcationIdRef = useRef(applicationId)
    const stateRef = useRef(imState)
    const chatIdRef = useRef(chatId)
    const router = useRouter()
    const [chatList, setChatList] = useState([])
    const [chatListLoading, setChatListLoading] = useState(false)
    const [isUnreadOn, setUnreadOn] = useState(false)
    const [status, setStatus] = useState()

    const searchParams = useMemo(() => {
        return {
            type: status,
            unread: isUnreadOn ? '1' : '0'
        }
    }, [isUnreadOn, status])
    const updateChatList = useCallback(() => {
        list(searchParams).then(result => result.data?.data ?? [])
    }, [searchParams, list])

    const filterMode = useMemo(() => {
        return !(!isUnreadOn && !status)
    }, [isUnreadOn, status])

    const onNoteiticationClick = useCallback(note => {
        router.push(note.link)
    }, [])
    const { postNote, props: notificationProps } = usePushNotification(onNoteiticationClick)
    const postNoteRef = useRef(postNote)
    useEffect(() => {
        postNoteRef.current = postNote
    }, [postNote])
    useEffect(() => {
        if (!chatListLoading && filterMode) {
            setChatListLoading(true)
            list(searchParams).then(result => {
                setChatList(result.data?.data ?? [])
                // if (!status && !isUnreadOn) {
                //     dispatch(updateDefaultChatList({ chatList: result.data?.data?.chats ?? [] }))
                // }
            }).finally(() => setChatListLoading(false))
        }
    }, [searchParams])
    useEffect(() => {
        if (filterMode) {
            setChatListLoading(true)
            list(searchParams).then(result => {
                setChatList(result.data?.data)
                // if (!status && !isUnreadOn) {
                //     dispatch(updateDefaultChatList({ chatList: result.data?.data?.chats ?? [] }))
                // }
            }).finally(() => setChatListLoading(false))
        }

    }, [searchParams, filterMode])
    useEffect(() => {
        if (userId) {
            IMManager.accessUser(
                '' + userId + '_j',
                auid => getAuth(auid).then(result => {
                    if (!getCookie('accessToken')) {
                        return Promise.reject(new Error('not login!'))
                    }
                    return result?.data?.data?.authcode
                }),
                auids => {
                    const userIds = auids
                        .filter(auid => auid && auid !== 'undefined')
                        .map(auid => auid.replace('_r', ''))
                    const jobseekerAuid = auids.find(auid => auid.includes('_j'))
                    if (jobseekerAuid) {
                        throw new Error(`Wrong auid found jobseeker id in the recruiter side: auid:${jobseekerAuid}`)
                    }
                    return Promise.resolve().then(() => {
                        if (auids.length) {
                            return userInfo(userIds).then(userInfosData => {
                                const userInfos = userInfosData?.data?.data ?? []
                                return userInfos.map(userInfo => ({
                                    auid: '' + userInfo.id + '_r',
                                    item: {
                                        avatar: userInfo.avatar,
                                        name: userInfo.full_name
                                    }
                                }))
                            })
                        } else {
                            return []
                        }
                    })

                }
            )
        } else {
            dispatch(fetchUserOwnDetailRequest({}))
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
            contextRef.current?.closeExchangeConfirm?.()
            contextRef.current?.closeCancelDetail?.()
            contextRef.current?.closeCancel?.()
            contextRef.current?.closeIssue?.()
            contextRef.current?.closeEditCommonPhrasesList?.()
            contextRef.current?.closeCommonPhrases?.()
            contextRef.current?.closeEditOneCommonPhrases?.()
            contextRef.current?.closeCreateOneCommonPhrases?.()
            contextRef.current?.closeDeleteOneCommonPhrases?.()
            contextRef.current?.closeAttend?.()
            contextRef.current?.closeAskFailed?.()
            contextRef.current?.closeJobDetail?.()
            contextRef.current?.closeExchangeDetail?.()
        },
        updateUser() {
            dispatch(fetchUserOwnDetailRequest({ accessToken }))
        },
        handleError(e) {
            const content = errorParser(e)
            if (typeof content === 'string') {
                contextRef.current?.showToast?.('error', content)
            } else {
                contextRef.current?.showToast?.('error', e.toString())
            }
        },
        handleFinish(type) {
            if (type === 'verifySuccess') {
                dispatch(fetchUserOwnDetailSetMobileVerified())
            }
        },
        isUserNumberValidate() {
            return userDetailRef.current?.is_mobile_verified
        },
        updateData(data) {
            if (+data?.data?.id === +contextRef.current.getChatId()) {
                const newData = {
                    ...data?.data?.job_application,
                    initiated_role: data?.data?.initiated_role,
                    chatStatus: data?.data?.status
                }
                contextRef.current.imState = newData
                const chatId = chatIdRef.current
                dispatch(updateImState({ chatId, imState: newData }))
            }
        },
        getLocalImState(chatId) {
            return imStateMapRef.current?.['' + chatId]
        },
        updateImState(chatId, data) {
            const newData = {
                ...data?.data?.job_application,
                initiated_role: data?.data?.initiated_role,
                chatStatus: data?.data?.status
            }
            dispatch(updateImState({ chatId, imState: newData }))
        },

        updatePath(path, data) {
            if (path && data.data) {
                const state = contextRef.current.getState()
                const newState = { ...state, [path]: data.data }
                const chatId = chatIdRef.current
                dispatch(updateImState({ chatId, imState: newState }))
            }
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
            setChatId(chatId)
        },
        showToast(type, content) {
            dispatch(
                displayNotification({
                    open: true,
                    message: content,
                    severity: type
                })
            )
        },
        postPageNotification(message, state) {
            console.log('postPageNotification', message.content)
            if (message.type === 1) {
                postNoteRef.current?.({
                    id: message.amid,
                    title: state?.recruiter?.full_name ?? 'New Message',
                    content: message?.content?.text,
                    link: `/chat/${message?.aChatId}`
                })
            }
        },
        postLocalNotification(message, state) {
            console.log('postLocalNotification', message)
            const params: any = {
                im_amid: message?.amid,
                im_achat_id: message?.aChatId,
                im_title: JSON.stringify({
                    t: 't',
                    v: state?.recruiter?.full_name ?? 'New Message'
                }),
                auth_role: 'jobseeker',
                im_sender_id: `"${userDetailRef.current?.id}_j"`,
                im_receive_ids: `["${userDetailRef.current?.id}_j"]`,
                im_type: '' + message.type
            }
            if (message.type === 1) {
                params.im_body = JSON.stringify([
                    {
                        t: 't',
                        v: message.content.text
                    }
                ])
                // const note = new Notification(state?.recruiter?.full_name ?? 'New Message', {
                //     body: message.content.text,
                //     image: state?.recruiter?.avatar
                // })
                // note.addEventListener('click', () => {
                //     router.push(`/chat/${message?.aChatId}`)
                // })
            } else if (message.type === 2) {
                params.im_body = JSON.stringify([
                    {
                        t: 't',
                        v: '[image]'
                    }
                ])
                // const note = new Notification(state?.recruiter?.full_name, {
                //     body: '[image]',
                //     image: state?.recruiter?.avatar
                // })
                // note.addEventListener('click', () => {
                //     router.push(`/chat/${message?.aChatId}`)
                // })
            }
            pushNotification(params)
                .then(result => console.log('pushNotifictionSuccess', result))
                .catch(e => console.log('pushNotifictionError', e))

        },
        updateTotalUnreadNumber(totalUnreadNumber) {
            setTotalUnread(totalUnreadNumber)
        },
        self_role: 'jobseeker'
    } as any)
    const interpreter = hooks.useInterpreter(interpreters, contextRef)
    const imStatus = hooks.useInitChat(interpreter, imState, chatId, filterMode, chatList, updateChatList)

    return <Provider value={{
        userDetail,
        userId,
        imState,
        applicationId,
        contextRef,
        loading,
        mobile,
        chatId,
        totalUnread,
        chatListLoading,
        isUnreadOn,
        setUnreadOn,
        chatList,
        filterMode,
        updateChatList,
        interpreter,
        imStatus,
        status,
        setStatus,
        postNote
    }}>{userId ? <>
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
        <ExchangeConfirmModal
            loading={loading}
            contextRef={contextRef}
            applicationId={applicationId}
        />
        <ExchangeDetailModal
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
        <ViewJobModal
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
            userId={userId}
            applicationId={applicationId}
            contextRef={contextRef}
        />
    </> : null}

        {children}
        <NotificationContainer {...notificationProps} />
    </Provider>
}

export default IMProvider