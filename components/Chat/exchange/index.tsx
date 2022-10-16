/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { assign } from 'lodash-es'
const ExchangeModal = (props: any) => {
    const { contextRef, loading, applicationId } = props
    const [show, setShow] = useState(false)
    const [step, setStep] = useState('init')
    const [otp, setOtp] = useState('123456')
    const actionsRef = useRef<any>()
    const context = {
        showExchangeNumber(actions) {
            actionsRef.current = actions
            setShow(true)
            setStep(actions.step)
        },
        closeExchange() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const rightButtonText = useMemo(() => {
        if (step === 'verified') {
            return 'Send'
        } else {
            return 'Verify'
        }
    }, [step])
    const rightBtnClick = useCallback(() => {
        if (step === 'verified') {
            actionsRef.current?.sendNumber?.({ applicationId })
        } else {
            actionsRef.current?.verify?.(otp)
        }
    }, [step])
    const sendText = useMemo(() => {
        if (step === 'init') {
            return 'Send OTP'
        } else {
            return 'Resend OTP'
        }
    }, [step])
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.close?.()}
        headerTitle={'Exchange Number Modal'}
        firstButtonText='Cancel'
        secondButtonText={rightButtonText}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current?.close?.()}
        handleSecondButton={rightBtnClick}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div >
            Exchange Number  Modal step:{step}
            <a onClick={() => actionsRef.current.sendOTP?.()}>{sendText}</a>
        </div>
    </Modal>
}
export default ExchangeModal