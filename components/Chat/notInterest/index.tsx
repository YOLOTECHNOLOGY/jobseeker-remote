/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import styles from './index.module.scss'
const NotInterestModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, applicationId ,lang} = props
    const {
        JobCcopeIsNotWhat,
        theSalaryIsNotWithin,
        notInterested,
        workingLocationIsTooFar,
        cancel,
        send,
        pleaseShareUsWhyThisRole
    } = lang ?? {}
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
        JobCcopeIsNotWhat,
        theSalaryIsNotWithin,
        workingLocationIsTooFar
    ]
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={notInterested}
        firstButtonText={cancel}
        secondButtonText={send}
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
        <p>{pleaseShareUsWhyThisRole}</p>
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