import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { useSelector } from 'react-redux'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import styles from './index.module.scss'
const IssueModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, data, applicationId, loading } = props
    const [value, onChange] = useState<any>()
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
    const options = useSelector(
        (store: any) =>
            store?.config?.config?.
                response?.inputs?.report_interview_reasons ?? [])
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Issues during interview'}
        firstButtonText='Back'
        secondButtonText='Send'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        isSecondButtonDisabled={!value}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            inviteInterviewId: data.id,
            params: {report_reason_id:value}
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p className={styles.mainText}>
            Please share the issue that you would like to report
        </p>
        <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map(item => {
                return <FormControlLabel
                    key={item.id}
                    value={item.id}
                    control={<Radio />}
                    label={item.title}
                />
            })}
        </RadioGroup>
    </Modal>
}

export default IssueModal