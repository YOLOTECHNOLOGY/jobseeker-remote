import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'

let timer = null
// 默认位数
const DEFAULT_LENGTH = 6
const originTimer = 60

interface IProps {
  length?: number
  sendOpt: Function
  error?: string
  lang: any
}

const Countdown = (props: IProps) => {
  const {
    length = DEFAULT_LENGTH,
    sendOpt,
    error,
    lang
    // number
  } = props
  const { newGetStarted } = lang

  const [countdown, setCountdown] = useState<number>(originTimer)

  const timerRef = useRef(originTimer)

  useEffect(() => {
    timer = setInterval(() => {
      const newTime = timerRef.current - 1
      if (newTime <= 0) {
        clearInterval(timer)
        timerRef.current = originTimer
      } else {
        timerRef.current = newTime
      }
      setCountdown(newTime)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <p className={styles.countdown}>
      {countdown <= 0 ? (
        <span className={styles.resendCode} onClick={() => sendOpt()}>
          {newGetStarted.resendCode}
        </span>
      ) : (
        countdown + 's'
      )}
    </p>
  )
}

export default Countdown
