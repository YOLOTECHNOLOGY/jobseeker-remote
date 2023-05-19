import Modal from 'components/Modal'
import React, { useEffect, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { getDictionary } from 'get-dictionary'
const CancelModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId,lang } = props
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
    const [dic, setDic] = useState<any>({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatInterview)
                }
            })
    }, [lang])
    const [cancelledReason, setCancelledReason] = useState('')
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={dic.cancelInterview}
        firstButtonText={dic.back}
        secondButtonText={dic.send}
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
        <p className={styles.mainText}>{dic.cancelReasonLabel}</p>
        <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            name='radio-buttons-group'
            onChange={(e) => setCancelledReason(e.target.value)}
        >
            <FormControlLabel value={dic.acceptAnother} control={<Radio />} label={dic.acceptAnother} />
            <FormControlLabel value={dic.retime} control={<Radio />} label={dic.retime} />
        </RadioGroup>
    </Modal>
}

export default CancelModal