/* eslint-disable camelcase */
import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { IMManager } from 'imforbossjob'
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
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { getAuth } from 'helpers/interpreters/services/chat'
import CommonPhrases from 'components/Chat/commonPhrases'
import ViewJobModal from './viewJob'
import ExchangeConfirmModal from './exchange/confirm'
export const IMContext = createContext<any>({})
const Provider = IMContext.Provider
const IMProvider = ({ children }: any) => {
    const [chatId, setChatId] = useState()
    const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
    const userDetailRef = useRef(userDetail)
    const userId = userDetail.id
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({} as any)
    const [mobile, setMobile] = useState(false)
    useEffect(() => {
        const old: any = window.onresize
        setMobile(document.body.clientWidth < 576)
        window.onresize = (...args) => {
            old?.(...args)
            setMobile(document.body.clientWidth < 576)
        }
        return () => window.onresize = old
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
    console.log({userDetail})
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
                setImState(newData)
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
        self_role: 'jobseeker'
    } as any)

    return <Provider value={{
        userDetail,
        userId,
        imState,
        applicationId,
        contextRef,
        loading,
        mobile,
        chatId
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
            data={imState?.interview}
            applicationId={applicationId}
            contextRef={contextRef}
        />
    </> : null}

        {children}
    </Provider>
}

export default IMProvider