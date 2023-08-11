import React, { useState, useRef, useEffect, useMemo, CSSProperties } from 'react'
import styles from './index.module.scss'
// 默认位数
const DEFAULT_LENGTH = 6

interface ICaptchaProps {
  value?: string
  onChange?: (value: string) => void
  length?: number
  autoFocus?: boolean
  className?: string | undefined
  style?: CSSProperties | undefined
  lang?: any
}

const Captcha = (props: ICaptchaProps, ref) => {
  const { value = '', onChange, length = DEFAULT_LENGTH, autoFocus = false, lang } = props
  // 组件内部维护的输入框输入值
  const [inputValue, setInputValue] = useState(value || '')
  const [currentIndex, setCurrentIndex] = useState(0)

  // 验证码数组
  const codeArray = useMemo(() => {
    setCurrentIndex(inputValue?.length)
    console.log({ inputValue })
    onChange?.(inputValue)
    return new Array(length).fill('').map((item, index) => inputValue[index] || '')
  }, [inputValue, length])

  // 是否获取焦点，仅在 focus 时展示 Input 闪烁条
  const [isFocused, setFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const tempValue = value.replace(/[^0-9]/g, '').slice(0, length)
    setInputValue(tempValue)
  }, [value, length])

  ref.current = {
    focus: () => inputRef.current?.focus()
  }
  // useEffect(() => {
  //   if (autoFocus) {
  //     setTimeout(() => {
  //       inputRef.current?.focus()
  //       setFocus(true)
  //     }, 200)
  //   }
  // }, [])

  const handleInputCodeChange = (e: any) => {
    const eValue = e.target.value
    const tempValue = eValue.replace(/[^0-9]/g, '').slice(0, length)
    setInputValue(tempValue)
  }

  const handleCodeBoxClick = (e: any) => {
    if (inputValue?.length === DEFAULT_LENGTH) {
      setCurrentIndex(DEFAULT_LENGTH - 1)
    }
    e.preventDefault()
    inputRef.current?.focus()
    setFocus(true)
  }

  return (
    <div className={`${styles.captcha} ${styles.captchaThemeBox}`}>
      <div className={styles.codeBox} onClick={(e) => handleCodeBoxClick(e)}>
        {codeArray.map((item, index) => {
          const isItemActive = isFocused && index == currentIndex
          return (
            <div
              key={index + '@' + item}
              className={`
                ${styles.itemContent}
                ${item ? styles.itemContentHit : ''}
                ${isItemActive ? styles.itemContentActive : ''}`}
            >
              {item}
            </div>
          )
        })}
      </div>
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
  )
}
export default React.forwardRef(Captcha)
