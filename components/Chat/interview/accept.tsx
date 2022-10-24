import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import InterviewDetail from './interviewDetail'

const AcceptModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showAccept(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeAccept() {
            setShow(false)
        }
    }
    console.log('acceptData',data)
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'interview invited accept modal'}
        firstButtonText='Decline'
        secondButtonText='Accept'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.declined?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        handleSecondButton={() => actionsRef.current.accept?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <InterviewDetail data={data}/>
    </Modal>
}

export default AcceptModal