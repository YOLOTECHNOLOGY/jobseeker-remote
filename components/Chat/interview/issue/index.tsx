import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
const IssueModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, data,applicationId,loading } = props
    const actionsRef = useRef({} as any)
    const context = {
        showIssue(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeIssue() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Report issue'}
        firstButtonText='Back'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            inviteInterviewId: data.id,
            params:{}
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
    </Modal>
}

export default IssueModal