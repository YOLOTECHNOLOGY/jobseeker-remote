import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
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
    const imState = contextRef.current?.getState()

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={`Interview Invitation from ${imState?.company?.name ?? 'company'}`}
        firstButtonText='Back'
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
        <p className={styles.mainText}>By accepting this interview invite, I agreed that I will show up for the interview at the given time and place. 
            If I need to change the time, I will notify the recruiter at least 7 hours in advance.</p>
        <p className={styles.subText}>Job seekers who do not turn up for interview will be marked as “No Show”. Job seekers who accumulate 3 no-show records in 3 months will be banned from using Bossjob for 6 months.</p>
    </Modal>
}

export default ConfirmModal