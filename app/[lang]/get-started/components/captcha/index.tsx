import React, { useState, useRef, useEffect, useMemo, CSSProperties } from 'react'
import styles from '../../index.module.scss'
import errorText from '../errorText'
// 默认位数
const DEFAULT_LENGTH = 6

interface ICaptchaProps {
  /**
   * @description       输入框内容
   * @default           ''
   */
  value?: string
  /**
   * @description       输入框内容变化时的回调
   */
  onChange?: (value: string) => void
  /**
   * @description       验证码长度
   * @default           4
   */
  length?: number

  /**
   * @description       是否默认 focus
   * @default           false
   */
  autoFocus?: boolean
  className?: string | undefined
  style?: CSSProperties | undefined
  sendOpt?: () => void
  error?: string
  lang?: any
  number: number
}

let timer = null

const origninTimer = 60

const Captcha: React.FC<ICaptchaProps> = (props) => {
  const {
    value = '',
    onChange,
    length = DEFAULT_LENGTH,
    autoFocus = false,
    sendOpt,
    error,
    lang,
    number
  } = props
  const { newGetStarted } = lang
  // 组件内部维护的输入框输入值
  const [inputValue, setInputValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  // 验证码数组
  const codeArray = useMemo(() => {
    setCurrentIndex(inputValue?.length)
    return new Array(length).fill('').map((item, index) => inputValue[index] || '')
  }, [inputValue, length])
  // 是否获取焦点，仅在 focus 时展示 Input 闪烁条
  const [isFocused, setFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const tempValue = value.replace(/[^0-9]/g, '').slice(0, length)
    setInputValue(tempValue)
  }, [value, length])

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus()
        setFocus(true)
      }, 200)
    }
  }, [])

  const [countdown, setCountdown] = useState<number>(origninTimer)

  const timerRef = useRef(origninTimer)

  useEffect(() => {
    timer = setInterval(() => {
      const newTime = timerRef.current - 1
      if (newTime <= 0) {
        clearInterval(timer)
        timerRef.current = origninTimer
      } else {
        timerRef.current = newTime
      }
      setCountdown(newTime)
    }, 1000)
  }, [number])

  const handleInputCodeChange = (e: any) => {
    const eValue = e.target.value
    const tempValue = eValue.replace(/[^0-9]/g, '').slice(0, length)
    setInputValue(tempValue)
    onChange?.(tempValue)
  }

  const handleCodeBoxClick = (e: any) => {
    if (inputValue?.length === DEFAULT_LENGTH) {
      setCurrentIndex(DEFAULT_LENGTH -1)
    }
    e.preventDefault()
    inputRef.current?.focus()
    setFocus(true)
  }

  return (
    <>
      <div className={`${styles.captcha} ${styles.captchaThemeBox}`} >
        <div className={styles.codeBox}  onMouseDown={(e) => handleCodeBoxClick(e)}>
          {codeArray.map((item, index, array) => {
            const prevItemValue = index === 0 ? '-1' : array[index - 1]
            // const isItemActive = isFocused && !!prevItemValue && !item
            const isItemActive = isFocused && index == currentIndex
            return (
              <div
               
                key={index}
                className={`${styles.itemContent} ${isItemActive ? styles.itemContentActive : ''}`}
              >
                {item}
              </div>
            )
          })}
        </div>
        {error ? <p className={styles.optErr}>{errorText(error)}</p> : null}
        <div className={styles.InputBoxWrap}>
          <input
            type='number'
            value={inputValue}
            onChange={handleInputCodeChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            pattern='[0-9]*'
            autoComplete='one-time-code'
            inputMode='numeric'
            maxLength={length}
            ref={inputRef}
          />
        </div>
      </div>
      <p className={styles.countdown}>
        {countdown <= 0 ? (
          <span className={styles.resendCode} onClick={() => sendOpt()}>
            {newGetStarted.resendCode}
          </span>
        ) : (
          countdown + 's'
        )}
      </p>
    </>
  )
}
export default Captcha
