'use client'
import React, { createContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { IMManager, hooks } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'app/[lang]/chat/[chat_id]/components/sendResume'
import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import Interview from 'app/[lang]/chat/[chat_id]/components/interview'
import NotInterestModal from 'app/[lang]/chat/[chat_id]/components/notInterest'
import { getCookie } from 'helpers/cookies'
import ExchangeModal from 'app/[lang]/chat/[chat_id]/components/exchange'
import CancelDetailModal from 'app/[lang]/chat/[chat_id]/components/interview/cancelDetail'
import CancelModal from 'app/[lang]/chat/[chat_id]/components/interview/cancel'
import IssueModal from 'app/[lang]/chat/[chat_id]/components/interview/issue'
import { fetchUserOwnDetailRequest, fetchUserOwnDetailSetMobileVerified } from 'store/actions/users/fetchUserOwnDetail'
import { getAuth } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import { userInfo } from 'app/[lang]/chat/[chat_id]/interpreters/services/userInfo'
import CommonPhrases from 'app/[lang]/chat/[chat_id]/components/commonPhrases'
import ViewJobModal from './viewJob'
import ExchangeConfirmModal from './exchange/confirm'
import { updateImState } from 'store/actions/chat/imState'
import { list } from 'app/[lang]/chat/[chat_id]/interpreters/services/chat'
import NotificationContainer, { usePushNotification } from './notificationContainer'
import ExchangeDetailModal from './exchange/detail'
import interpreters from 'app/[lang]/chat/[chat_id]/interpreters'
import { useRouter } from 'next/navigation'
import errorParser from 'helpers/errorParser'
import { pushNotification } from 'store/services/notification'
import { scripts } from 'imforbossjob'
import OfferModal from './offer'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'
import AutoSendResumeModal from './autoSendResume'
const { offerJobseeker: { getDataAndShowOfferMessageScript } } = scripts
export const IMContext = createContext<any>({})
const Provider = IMContext.Provider
const msgToNote = (message, state) => {
    if (message.type === 1) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: message?.content?.text,
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 2) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: '[Picture]',
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 19 && message.amid.indexOf('resume_request-recruiter_create') >= 0) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: 'Boss has requested your resume',
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 19 && message.amid.indexOf('contact_exchange_request-create') >= 0) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: 'Boss has requested to exchange mobile number with you',
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 19 && message.amid.indexOf('interview-create') >= 0) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: 'Boss has sent you an interview invite',
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 19 && message.amid.indexOf('location_confirmation-create') >= 0) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: 'Boss has shared the working location with you',
            link: `/chat/${message?.aChatId}`
        }
    } else if (message.type === 19 && message.amid.indexOf('interview-update_result') >= 0) {
        return {
            id: message.amid,
            title: state?.recruiter?.full_name ?? 'New Message',
            content: 'Boss has sent you the interview result',
            link: `/chat/${message?.aChatId}`
        }
    }
}

const IMProvider = ({ children, lang }: any) => {
    const [chatDictionary, setChatDictionary] = useState({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setChatDictionary(dic.chat)
                }
            })
    }, [lang])

    const langRef = useRef(lang)
    useEffect(() => {
        langRef.current = lang
    }, [lang])
    const config = useSelector((store: any) => store.config.config.response ?? {})

    const translate = useCallback((key, ...args) => {
        if (!chatDictionary) {
            return key
        } else if (args.length === 0) {
            return chatDictionary?.[key]
        } else {
            return formatTemplateString(key, ...args)
        }
    }, [chatDictionary])
    useEffect(() => {
        if (window?.SharedWorker && (window as any)?.imSharedWorker?.port) {
            (window as any).imSharedWorker.port.onmessage = () => {
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
    const chatListRef = useRef(chatList)
    useEffect(() => {
        chatListRef.current = chatList
    }, [chatList])
    const [chatListLoading, setChatListLoading] = useState(false)
    const [isUnreadOn, setUnreadOn] = useState(false)
    const [status, setStatus] = useState()

    const searchParams = useMemo(() => {
        return {
            type: status,
            unread: isUnreadOn ? '1' : '0'
        }
    }, [isUnreadOn, status])

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
    const updateChatList = useCallback(() => {
        if (!chatListLoading && accessToken) {
            setChatListLoading(true)
            const params = filterMode ? searchParams : { type: 'not_interested' }
            list(params).then(result => {
                setChatList(result.data?.data ?? [])

            }).finally(() => setChatListLoading(false))
        }
    }, [searchParams, filterMode, accessToken])
    const updateChatListRef = useRef(updateChatList)
    useEffect(() => {
        updateChatListRef.current = updateChatList
        updateChatList()
    }, [updateChatList])
    useEffect(() => {
        if (lang) {
            // IMManager?.setCurrentLanguage?.(lang)
        }
    }, [lang])
    useEffect(() => {
        if (userId && accessToken) {
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
                    if (jobseekerAuid && jobseekerAuid !== userId + '_j') {
                        throw new Error(`Wrong auid found jobseeker id in the recruiter side: auid:${jobseekerAuid}`)
                    }
                    return Promise.resolve().then(() => {
                        if (auids.length) {

                            return userInfo(userIds.filter(auid => !auid.includes('_j'))).then(userInfosData => {
                                const userInfos = userInfosData?.data?.data ?? []
                                return new Promise(resolve => {
                                    const callBackUserInfo = () => {
                                        if (userDetailRef.current?.id) {
                                            const userInfoResult = [...userInfos.map(userInfo => ({
                                                auid: '' + userInfo.id + '_r',
                                                item: {
                                                    avatar: userInfo?.avatar ?? '',
                                                    name: userInfo.full_name
                                                }
                                            })), {
                                                auid: '' + userDetailRef.current?.id + '_j',
                                                item: {
                                                    avatar: userDetailRef.current?.avatar ?? '',
                                                    name: userDetailRef.current?.full_name
                                                }
                                            }
                                            ]
                                            resolve(userInfoResult)
                                        } else {
                                            setTimeout(() => callBackUserInfo(), 500)
                                        }
                                    }
                                    callBackUserInfo()
                                })
                            })
                        } else {
                            return []
                        }
                    })

                }
            )
        } else if (accessToken) {
            dispatch(fetchUserOwnDetailRequest({ accessToken }))
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
            contextRef.current?.closeOfferDetail?.()
            contextRef.current?.closeOfferMessage?.()
            contextRef.current?.closeEnableAutoSendResume?.()
            contextRef.current?.closeDisableAutoSendResume?.()
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
        getLang() {
            return langRef.current
        },
        getRouter() {
            return router
        },
        updateData(data) {
            if (+data?.data?.id === +contextRef.current.getChatId()) {
                const newData = {
                    ...data?.data?.job_application,
                    initiated_role: data?.data?.initiated_role,
                    delete_status: data?.data?.delete_status,
                    chatStatus: data?.data?.status,
                    self_role: 'jobseeker'
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
                delete_status: data?.data?.delete_status,
                chatStatus: data?.data?.status,
                self_role: 'jobseeker'
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
        updateChatList() {
            updateChatListRef.current?.()
        },
        changeChat(chatId) {
            // setChatId(chatId)
            router.push(`/${lang}/chat/${chatId}`)
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
            const msg = msgToNote(message, state)
            if (msg) {
                postNoteRef.current?.(msg)
            }
        },
        postLocalNotification(message, state) {
            const msg: any = msgToNote(message, state)
            if (msg) {
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
                    im_type: '' + message.type,
                    im_body: JSON.stringify([
                        {
                            t: 't',
                            v: msg.content
                        }
                    ])
                }
                pushNotification(params)
                    .then(result => console.log('pushNotifictionSuccess', result))
                    .catch(e => console.log('pushNotifictionError', e))
            }
        },
        updateTotalUnreadNumber(totalUnreadNumber) {
            setTotalUnread(totalUnreadNumber)
        },
        getChatList() {
            return chatListRef?.current
        },
        self_role: 'jobseeker'
    } as any)
    const interpreter = hooks.useInterpreter(interpreters, contextRef)
    const imStatus = hooks.useInitChat(interpreter, imState, chatId, filterMode, chatList, updateChatList)
    useEffect(() => {
        const receive = e => {
            const data = e.detail?.data ?? {}
            if (data?.landing_page === 'Offer dialog') {
                interpreter(getDataAndShowOfferMessageScript(data.application_id, data.offer_id))
            }
        }
        window.addEventListener('receiveImNotification', receive)
        return () => window.removeEventListener('receiveImNotification', receive)
    }, [])
    return <Provider
        key='im-provider'
        value={{
            ready: true,
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
            postNote,
            translate
        }}>{userId ? <>
            <SendResumeModal
                loading={loading}
                contextRef={contextRef}
                data={imState.resume_request}
                applicationId={applicationId}
                lang={chatDictionary}
            />

            <Interview
                loading={loading}
                contextRef={contextRef}
                data={imState.interview}
                applicationId={applicationId}
                lang={lang}
            />
            <OfferModal
                loading={loading}
                contextRef={contextRef}
                lang={chatDictionary}
                applicationId={applicationId}
            />
            <ExchangeModal
                loading={loading}
                contextRef={contextRef}
                lang={lang}
                applicationId={applicationId}
            />
            <ExchangeConfirmModal
                loading={loading}
                contextRef={contextRef}
                lang={lang}
                applicationId={applicationId}
            />
            <ExchangeDetailModal
                loading={loading}
                contextRef={contextRef}
                lang={lang}
                applicationId={applicationId}
            />
            <NotInterestModal
                loading={loading}
                data={imState}
                applicationId={applicationId}
                lang={chatDictionary}
                contextRef={contextRef}
            />
            <IssueModal
                loading={loading}
                data={imState?.interview}
                lang={lang}
                applicationId={applicationId}
                contextRef={contextRef}
            />
            <ViewJobModal
                loading={loading}
                data={imState?.interview}
                lang={chatDictionary}
                applicationId={applicationId}
                contextRef={contextRef}
                config={config}
            />
            <CancelModal
                loading={loading}
                data={imState?.interview}
                applicationId={applicationId}
                lang={lang}
                contextRef={contextRef}
            />
            <AutoSendResumeModal
                loading={loading}
                data={imState?.interview}
                applicationId={applicationId}
                lang={lang}
                contextRef={contextRef}
            />
            <CancelDetailModal
                loading={loading}
                data={imState?.interview}
                lang={lang}
                applicationId={applicationId}
                contextRef={contextRef}
            />
            <CommonPhrases
                loading={loading}
                userId={userId}
                lang={lang}
                applicationId={applicationId}
                contextRef={contextRef}
            />
        </> : null}

        {children}
        <NotificationContainer {...notificationProps} />
    </Provider>
}

export default IMProvider