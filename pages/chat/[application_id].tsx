import React, { useEffect, useRef, useState } from 'react'
import { JobseekerChat } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/SendResume'
import interpreter from 'helpers/interpreters'
import { useDispatch, useSelector } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useRouter } from 'next/router'
import Interview from 'components/Chat/interview'
import NotInterestModal from 'components/Chat/notInterest'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'
import { getCookie } from 'helpers/cookies'
import ExchangeModal from 'components/Chat/exchange'
const Chat = () => {
    const router = useRouter()
    const { query: { application_id: applicationId } } = router
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({} as any)
    const accessToken = getCookie('accessToken')

    console.log({ imState })
    const dispatch = useDispatch()
    const applcationIdRef = useRef(applicationId)
    const stateRef = useRef(imState)
    const userDetail = useSelector((store: any) => store.users.fetchUserDetail.response)
    const userDetailRef = useRef(userDetail)
    useEffect(() => {
        applcationIdRef.current = applicationId
    }, [applicationId])
    useEffect(() => {
        stateRef.current = imState
    }, [imState])
    useEffect(() => {
        userDetailRef.current = userDetail
    }, [userDetail])
    useEffect(() => {
        if (!Object.keys(userDetail).length) {
            dispatch(fetchUserDetailRequest({ accessToken }))
        }
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
        },
        updateUser() {
            dispatch(fetchUserDetailRequest({ accessToken }))
        },
        handleError(e) {
            console.log('error', e)
        },
        handleFinish(type) {
            console.log('finish', type)
        },
        isUserNumberValidate() {
            return undefined
            return userDetailRef.current?.phone_num
        },
        updateData(data) {
            console.log('update', data)
            setImState(data?.data)
        },
        getApplicationId() {
            return applcationIdRef.current
        },
        getState() {
            return stateRef.current
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
            interpreter={script => interpreter(script).run(contextRef.current)}
        />
        <JobseekerChat
            loading={loading}
            imState={imState}
            applicationId={applicationId}
            interpreter={script => interpreter(script).run(contextRef.current)}
        />

    </>
}
export const getServerSideProps = () => {
    return { props: {} }
}
export default Chat