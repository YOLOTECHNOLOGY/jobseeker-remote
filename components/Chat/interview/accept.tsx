import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import InterviewDetail from './interviewDetail'
import { formatTemplateString } from 'helpers/formatter'

const AcceptModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId,dic } = props
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
    contextRef.current = assign(contextRef.current, context)
    const imState = contextRef.current?.getState()
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={formatTemplateString(dic.title, imState?.company?.name ?? 'company')}
        firstButtonText={dic.decline}
        secondButtonText={dic.accept}
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
        <InterviewDetail dic={dic} data={data}/>
    </Modal>
}

export default AcceptModal