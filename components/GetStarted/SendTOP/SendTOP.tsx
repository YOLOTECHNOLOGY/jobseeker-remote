import { useState } from 'react'
import React, { useEffect, useRef } from 'react'
import useWindowDimensions from 'helpers/useWindowDimensions'
import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import { useFirstRender } from 'helpers/useFirstRender'

// tools
import { handleNumericInput } from 'helpers/handleInput'

import styles from './SendTOP.module.scss'
import sendOTPstyles from './SendTOP.module.scss'
import classNames from 'classnames/bind'

const SendTOP = ({
  userId,
  COUNT_DOWN_VERIFY_DEFAULT,
  handleSendEmailTOP,
  email,
  emailTOP,
  setEmailTOP,
  isLoading,
  emailOTPInputDisabled,
  login,
  magicLink,
  emailTOPError,
  customizeSendOTPContainerMainFieldStyle,
  hideMagicLink,
  lang
}: any) => {
  const { width } = useWindowDimensions()
  const firstRender = useFirstRender()
  const [sendBtnDisabled, setSendBtnDisabled] = useState(true)
   
  const {
    welcomeBack,
    signUpAnAccount,
    pleaseEnter,
    enter6DigitOTP,
    heOTPYouHaveEnteredIsWrong,
    resendOTP,
    getOPT,
    havingTrouble,
    requestAmagicLink
  } = lang || {}

  // CountDo wn
  const refCountDownTimeName = useRef(null)
  const countDownVerify = useRef(COUNT_DOWN_VERIFY_DEFAULT)

  const magicLinkCountDownTime = useRef(null)
  const magicLinkNode = useRef(null)
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)
  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const [isShowMagicLink, setIsShowMagicLink] = useState(false)

  useEffect(() => {
    magicLinkCountDownTime.current = setTimeout(() => {
      setIsShowMagicLink(true)
      magicLinkNode.current.addEventListener('click', magicLink)
    }, 1000 * 60)
    // })
    return () => {
      clearInterval(magicLinkCountDownTime.current)
    }
  }, [])

  useEffect(() => {
    setIsShowCountDownSwitch(true)
  }, [])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify.current <= 1) {
          setIsShowCountDownSwitch(false)
        } else {
          countDownVerify.current = countDownVerify.current - 1
          setCountDown(countDownVerify.current)
        }
      }
      refCountDownTimeName.current = setInterval(eventCallBack, 1000)
      return () => clearInterval(refCountDownTimeName.current)
    } else {
      clearInterval(refCountDownTimeName.current)
      // setBtnDisabled(false)
      setSendBtnDisabled(false)
      countDownVerify.current = COUNT_DOWN_VERIFY_DEFAULT
      setCountDown(COUNT_DOWN_VERIFY_DEFAULT)
    }
  }, [isShowCountDownSwitch])

  useEffect(() => {
    if (String(emailTOP).length === 6) {
      login()
    }
  }, [emailTOP])

  const sendEmailOTP = () => {
    setSendBtnDisabled(true)
    setIsShowCountDownSwitch(true)
    handleSendEmailTOP()
  }

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <div className={classNames([sendOTPstyles.SendTOPContainer])}>
      <div className={styles.SendTOPContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {userId ? `${welcomeBack} 👏` : `${signUpAnAccount} 🎉`}
        </Text>
      </div>

      <div className={styles.SendTOPContainer_desc}>
        <Text
          tagName='p'
          textStyle='lg'
          className={classNames([styles.SendTOPContainer_desc_text])}
        >
          {pleaseEnter} {email}.
        </Text>
      </div>

      <div className={classNames([styles.SendTOPContainer_main])}>
        <MaterialTextField
          className={classNames([
            styles.SendTOPContainer_main_field,
            customizeSendOTPContainerMainFieldStyle
          ])}
          id='email'
          label={enter6DigitOTP}
          variant='outlined'
          autoFocus
          size='small'
          value={emailTOP || ''}
          autoComplete='off'
          error={emailTOPError ? true : false}
          onChange={(e) => setEmailTOP(handleNumericInput(e.target.value))}
          maxLength={6}
          disabled={emailOTPInputDisabled}
        />
        {width < 576 &&
          emailTOPError &&
          errorText(heOTPYouHaveEnteredIsWrong)}

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.SendTOPContainer_main_submit}
          disabled={sendBtnDisabled}
          // isLoading={isRegisteringJobseeker}
          isLoading={isLoading}
          onClick={sendEmailOTP}
        >
          <Text textStyle='lg' textColor='white' bold>
            {isShowCountDownSwitch && `${resendOTP} (${countDown}s)`}
            {!isShowCountDownSwitch && `${getOPT}`}
          </Text>
        </MaterialButton>
        {(width ?? 0)  > 576 &&
          emailTOPError &&
          errorText(heOTPYouHaveEnteredIsWrong)}
      </div>

      <div
        className={classNames([
          styles.SendTOPContainer_sendMagicLinkContariner,
          isShowMagicLink ? styles.SendTOPContainer_sendMagicLinkVisibility : ''
        ])}
      >
        {!hideMagicLink && (
          <div className={styles.SendTOPContainer_sendMagicLink}>
            <Text
              tagName='p'
              textStyle='lg'
              // onClick={magicLink}
              className={styles.SendTOPContainer_sendMagicLink_pNode}
            >
              {havingTrouble}?{' '}
              <a
                className={classNames([
                  styles.SendTOPContainer_sendMagicLink_magicLink,
                  isShowMagicLink ? styles.SendTOPContainer_sendMagicLinkVisibility_magicLink : ''
                ])}
                ref={magicLinkNode}
              >
                {requestAmagicLink}
              </a>
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(SendTOP)
