/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import styles from './index.module.scss'
const NotInterestModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, applicationId } = props
    const [reason, setReason] = useState('')

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
    const reasons = [
        'Job scope is not what I am looking for.',
        'The salary is not within my expected range.',
        'Working location is too far.'
    ]
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle='Not Interested'
        firstButtonText='Cancel'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.close?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            params: { not_interested_reason: reason }
        })}
        isSecondButtonDisabled={!reason}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p>Please share with us why this role is not what you are looking for and we will provide better job suggestion. This chat will be moved to “Not interested” folder.</p>
        <div>
            <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'
                onChange={(e) => setReason(e.target.value)}
            >
                {reasons.map(item => (
                    <FormControlLabel
                        classes={{ root: styles.item }}
                        key={item}
                        checked={item === reason}
                        value={item}
                        control={<Radio />}
                        label={<div className={styles.reason}>{item}</div>} />
                ))
                }
            </RadioGroup>
        </div>
    </Modal>
}
export default NotInterestModal