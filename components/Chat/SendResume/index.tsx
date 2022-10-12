import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
const SendResumeModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading } = props
    const actionsRef = useRef({} as any)
    const context = {
        showSendResume(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        
        closeSendResume() {
            setShow(false)
        },
        updateData(data){
            console.log('updateData',data)
        },
        
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