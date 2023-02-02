import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
const CancelModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showCancel(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeCancel() {
            setShow(false)
        }
    }
    const [cancelledReason, setCancelledReason] = useState('')
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Cancel Interview'}
        firstButtonText='Back'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            inviteInterviewId: data.id,
            params: {
                cancelled_reason: cancelledReason
            }
        })}
        isSecondButtonDisabled={!cancelledReason}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p className={styles.mainText}>You are about to cancel the interview. Please let recruiter know why you are cancelling this interview:</p>
        <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            onChange={(e) => setCancelledReason(e.target.value)}
        >
            <FormControlLabel value='I have accepted another offer.' control={<Radio />} label='I have accepted another offer.' />
            <FormControlLabel value='I would like to reschedule the interview timing.' control={<Radio />} label='I would like to reschedule the interview timing.' />
        </RadioGroup>
    </Modal>
}

export default CancelModal