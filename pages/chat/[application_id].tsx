import React, { useEffect, useRef, useState } from 'react'
import { JobseekerChat } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/SendResume'
import interpreter from 'helpers/interpreters'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useRouter } from 'next/router'
const Chat = () => {
    const router = useRouter()
    const { query: { application_id: applicationId } } = router
    const [loading, setLoading] = useState(false)
    const [imState, setImState] = useState({})
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
        },
        handleError(e) {
            dispatch(
                displayNotification({
                    open: true,
                    message: e?.toString?.() ?? 'Some error happens',
                    severity: 'error'
                })
            )
        },
        handleFinish(type) {
            dispatch(
                displayNotification({
                    open: true,
                    message: type,
                    severity: 'success'
                })
            )
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
        }
    } as any)
    return <>
        <SendResumeModal loading={loading} contextRef={contextRef} imState={imState} />
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