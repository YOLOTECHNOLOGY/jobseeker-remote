/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetailRequest } from 'store/actions/users/fetchUserDetail'
import { getCookie } from 'helpers/cookies'
import { getDictionary } from 'get-dictionary'
import { formatTemplateString } from 'helpers/formatter'
const ExchangeModal = (props: any) => {
    const { contextRef, loading, applicationId, lang } = props
    const dispatch = useDispatch()
    const [countryCode, setCountryCode] = useState('+63')
    const [mobileNumber, setMobileNumber] = useState('')
    const [dic, setDic] = useState<any>({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatExchange)
                }
            })
    }, [lang])
    const [otp, setOtp] = useState('')

    const countryOptions = useSelector((store: any) => store.config.config.response?.country_lists
        ?.map?.(item => ({
            label: `${item.value} (${item.code})`,
            value: item.code,
            id: item.id
        }))
    )
    const number = useMemo(() => {
        if (countryCode && mobileNumber) {
            return [countryCode, mobileNumber].join('')
        } else {
            return ''
        }

    }, [countryCode, mobileNumber])
    const [show, setShow] = useState(false)
    const [step, setStep] = useState('init')
    const actionsRef = useRef<any>()
    const assessToken = getCookie('accessToken')
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
            dispatch(fetchUserDetailRequest({ assessToken }))
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const rightButtonText = useMemo(() => {
        if (step === 'verified') {
            return dic.send
        } else {
            return dic.verify
        }
    }, [step])
    // const mobile_country_id = find(smsCountryList, { 'value': smsCode })?.id
    // smsOTPChangePhoneNumverGenerate({ phone_num: smsCode + phoneNum, mobile_country_id })
    const rightBtnClick = useCallback(() => {
        if (step === 'verified') {
            actionsRef.current.sendNumber?.({ applicationId })
        } else {
            const mobile_country_id = countryOptions?.find(e => e.value = countryCode)?.id
            actionsRef.current.verify?.({ otp, phone_num: countryCode + mobileNumber, mobile_country_id })
        }
    }, [step, otp, applicationId, mobileNumber])
    const sendText = useMemo(() => {
        if (step === 'init') {
            return dic?.sendOtp
        } else if (count >= 0) {
            return formatTemplateString(dic?.resendOtpIn, '' + count)
        } else {
            return dic?.resendOtp
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
        headerTitle={dic?.exchangeTitle}
        firstButtonText={dic?.cancel}
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
            <p className={styles.modalTitle}>
                {showSendResult ? dic?.sureText : dic?.verifyText}
            </p>
            <div className={styles.formContainer}>
                {showSendOTP && <>
                    {/* <label>This allow easier communication with the talent. Please verify your mobile number.</label> */}
                    <div className={styles.numberContainer}>
                        <div
                            className={styles.selectContainer}
                        >
                            <MaterialBasicSelect
                                className={styles.fullWidth}
                                label={dic?.countryCode}
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                options={countryOptions}
                            />

                        </div>
                        <MaterialTextField
                            className={styles.inputContainer}
                            label={dic?.mobileNumber}
                            size='small'
                            value={mobileNumber}
                            defaultValue={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </div>

                    <div className={classNames({
                        [styles.sendOTPButton]: true,
                        [styles.disabled]: !sendEnable
                    })}
                        onClick={() => {
                            const mobile_country_id = countryOptions?.find(e => e.value = countryCode)?.id
                            sendEnable && actionsRef.current.sendOTP?.({ params: { phone_num: number, mobile_country_id } })
                        }}
                    >{sendText}</div>
                </>}
                {showInputCode && <>
                    <label>{formatTemplateString(dic?.msgText, '' + number)}</label>
                    <MaterialTextField
                        className={styles.inputContainer}
                        label={dic?.digitPlaceholder}
                        size='small'
                        value={otp}
                        defaultValue={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                </>}
                {showSendResult && <>
                    {/* <label>This allow easier communication with the talent</label> */}
                    <div className={styles.detailItemContainer} >
                        <label>{dic?.mobileNumber}:</label>
                        <p>{number}</p>
                    </div>
                </>}
            </div>
        </div>
    </Modal>
}
export default ExchangeModal