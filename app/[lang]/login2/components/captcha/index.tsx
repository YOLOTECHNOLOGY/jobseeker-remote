import React, { useState, useRef, useEffect, useMemo, CSSProperties } from 'react'
import styles from '../../index.module.scss'
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
}
const Captcha: React.FC<ICaptchaProps> = (props)=>{

    const { value = '', onChange, length = DEFAULT_LENGTH, autoFocus = false } = props
    // 组件内部维护的输入框输入值
    const [inputValue, setInputValue] = useState('')
    // 验证码数组
    const codeArray = useMemo(() => {
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
        inputRef.current?.focus()
        setFocus(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    const handleInputCodeChange = (e: any) => {
      const eValue = e.target.value
      const tempValue = eValue.replace(/[^0-9]/g, '').slice(0, length)
  
      setInputValue(tempValue)
      onChange?.(tempValue)
    }
  
    const handleCodeBoxClick = (e: any) => {
      e.preventDefault()
      inputRef.current?.focus()
      setFocus(true)
    }
return <div className={`${styles.captcha} ${styles.captchaThemeBox}`}>
<div className={styles.codeBox} onMouseDown={handleCodeBoxClick}>
  {codeArray.map((item, index, array) => {
    const prevItemValue = index === 0 ? '-1' : array[index - 1]
    const isItemActive = isFocused && !!prevItemValue && !item
    return (
      <div
        key={index}
        className={`${styles.itemContent} ${
          isItemActive ? styles.itemContentActive : ''
        }`}
      >
        {item}
      </div>
    )
  })}
</div>
<div className={styles.InputBoxWrap}>
  <input
    type='text'
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

}
export default Captcha;