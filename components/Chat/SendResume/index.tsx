import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
const SendResumeModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading } = props
    const actionsRef = useRef({} as any)
    const dispatch = useDispatch()
    const context = {
        showSendResume(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        updateSendResume(payload) {
            console.log('updateSendResume', payload)
        },
        closeSendResume() {
            setShow(false)
        },
        onSendResumeError(error) {
            console.log('error', error)
        },
        updateData(data){
            console.log('updateData')
        },
        handleFinish(type) {
            
            if(type === 'sendResumeSuccess') {
                dispatch(
                    displayNotification({
                        open: true,
                        message: 'Sending resume successfully',
                        severity: 'success'
                    })
                )
            }
            if(type === 'declineSendResumeSuccess') {
                dispatch(
                    displayNotification({
                        open: true,
                        message: 'Decline resume successfully',
                        severity: 'success'
                    })
                )
            }
           
            setShow(false)
        },
        handleError(error) {
            dispatch(
                displayNotification({
                    open: true,
                    message: error,
                    severity: 'error'
                })
            )
            console.log(error)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={''}
        firstButtonText='Cancel'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.close?.()}
        handleSecondButton={() => actionsRef.current.send?.({ data: 'params for send request' })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        {'send resume modal'}
    </Modal>
}
export default SendResumeModal