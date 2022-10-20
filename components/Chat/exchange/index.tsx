/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'
import { getCookie } from 'helpers/cookies'
const ExchangeModal = (props: any) => {
    const { contextRef, loading, applicationId } = props
    const [countryCode, setCountryCode] = useState('')
    const [mobileNumber,setMobileNumber] = useState('')
    const [otp,setOtp] = useState('')
    const dispatch = useDispatch()
    const countryOptions = useSelector((store:any) => store.config.config.response?.inputs?.country_lists
        ?.map?.(item => ({
            label: `${item.code}(${item.value})`,
            value: item.code
        }))
    )
    const number = useMemo(() => {
        if (countryCode && mobileNumber) {
            return [countryCode, mobileNumber].join(' ')
        } else {
            return ''
        }

    }, [countryCode, mobileNumber])
    const [show, setShow] = useState(false)
    const [step, setStep] = useState('init')
    const actionsRef = useRef<any>()
    const assessToken =getCookie('accessToken')  
     const [count, setCount] = useState(-1)
    const context = {
        showExchangeNumber(actions) {
            actionsRef.current = actions
            setShow(true)
            setStep(actions.step)
        },
        closeExchange() {
            setShow(false)
        },
        startCountDown() {
            setCount(60)
        },
        updateUser() {
            console.log('updateUser')
            dispatch(fetchUserDetailRequest({assessToken}))
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
            actionsRef.current.sendNumber?.({ applicationId })
        } else {
            actionsRef.current.verify?.(otp)
        }
    }, [step])
    const sendText = useMemo(() => {
        if (step === 'init') {
            return 'Send OTP'
        } else {
            return 'Resend OTP ' + (count >= 0 ? `in ${count}s` : '')
        }
    }, [count, step, actionsRef.current])
    const sendEnable = useMemo(() => {
        if (step === 'verified') {
            return false
        } else if (!number.length) {
            return false
        } else if (count >= 0) {
            return false
        } else if (loading) {
            return false
        }
        return true
    }, [count, step, number, loading])

    const showSendOTP = useMemo(() => {
        return step !== 'verified'
    }, [step])

    const showInputCode = useMemo(() => {
        return step === 'OTPSended'
    }, [step])

    const showSendResult = useMemo(() => {
        return step === 'verified'
    }, [step])

    const rightBtnEnable = useMemo(() => {
        if (step === 'verified') {
            return number.length > 0
        } else {
            return otp.length === 6
        }
    }, [step, otp])
    useEffect(() => {
        if (count > 0) {
            setTimeout(() => {
                setCount(count - 1)
            }, 1000)
        } else {
            setCount(-1)
        }
    }, [count])
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.close?.()}
        headerTitle={'Exchange Number Modal'}
        firstButtonText='Cancel'
        secondButtonText={rightButtonText}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        isSecondButtonDisabled={!rightBtnEnable}
        handleFirstButton={() => actionsRef.current?.close?.()}
        handleSecondButton={rightBtnClick}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.modalContainer}>
            <p className={styles.modalTitle}>Exchange Mobile Number with Talent</p>
            <div className={styles.formContainer}>
                {showSendOTP && <>
                    <label>This allow easier communication with the talent. Please verify your mobile number.</label>
                    <div className={styles.numberContainer}>
                        <div
                            className={styles.selectContainer}
                        >
                            <MaterialBasicSelect
                                className={styles.fullWidth}
                                label='Country code'
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                options={countryOptions}
                            />

                        </div>
                        <MaterialTextField
                            className={styles.inputContainer}
                            label="Mobile number"
                            size='small'
                            value={mobileNumber}
                            defaultValue={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                     </div>

                    <MaterialButton disabled={!sendEnable} onClick={() => actionsRef.current.sendOTP?.(number)}>{sendText}</MaterialButton>
                </>}
                {showInputCode && <>
                    <label>Enter the code that we have message to {number}</label>
                    <MaterialTextField
                            className={styles.inputContainer}
                            label="Enter 6 digit OTP"
                            size='small'
                            value={otp}
                            defaultValue={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                   
                </>}
                {showSendResult && <>
                    <label>This allow easier communication with the talent</label>
                    <div className={styles.detailItemContainer} >
                        <label>Mobile number:</label>
                        <p>{number}</p>
                    </div>
                </>}
            </div>
        </div>
    </Modal>
}
export default ExchangeModal