/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
const NotInterestModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showNotInterest(actions) {
            actionsRef.current = actions
            setShow(true)
        },

        closeNotInterest() {
            setShow(false)
        }

    }
    const reason = 'some reason'
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
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            requestResumeId: data.id,
            params: { reason: reason }
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        {'not interest modal'}
    </Modal>
}
export default NotInterestModal