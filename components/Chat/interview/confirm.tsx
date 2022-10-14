import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'

const ConfirmModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showConfirm(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeConfirm() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'interview invited confirm modal'}
        firstButtonText='Decline'
        secondButtonText='Accept'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.accept?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
    </Modal>
}

export default ConfirmModal