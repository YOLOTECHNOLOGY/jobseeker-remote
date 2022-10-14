import React, { useEffect, useRef, useState } from 'react'
import { JobseekerChat } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/SendResume'
import interpreter from 'helpers/interpreters'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useRouter } from 'next/router'
import Interview from 'components/Chat/interview'
const Chat = () => {
    const router = useRouter()
    const { query: { application_id: applicationId } } = router
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({} as any)
    console.log({ imState })
    const dispatch = useDispatch()
    const applcationIdRef = useRef(applicationId)
    const stateRef = useRef(imState)
    useEffect(() => {
        applcationIdRef.current = applicationId
    }, [applicationId])
    useEffect(() => {
        stateRef.current = imState
    }, [imState])
    const contextRef = useRef({
        setLoading,
        hideModals() {
            contextRef.current?.closeSendResume?.()
            contextRef.current?.closeConfirm?.()
            contextRef.current?.closeAccept?.()
            contextRef.current?.closeDetail?.()
        },
        handleError(e) {
            console.log('error', e)
        },
        handleFinish(type) {
            console.log('finish', type)
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