import { useState, useEffect, useRef } from 'react'

/* Vendors */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Assets */
import styles from './Button.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
  primary?: boolean
  secondary?: boolean
  disabled?: boolean
  isLoading?: boolean
}

const Button = ({
  children,
  style,
  className,
  primary,
  secondary,
  disabled,
  isLoading,
  ...rest
}: ButtonProps) => {
  const componentClass = {
    button: true,
    buttonPrimary: primary,
    buttonSecondary: secondary,
  }
  const cx = classNames.bind(styles)
  const buttonClass = cx([componentClass])

  /* Capture the dimensions of the button before the loading happens
  so it doesn’t change size when showing the loader */
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  const fixButtonDimension = {
    width: `${width}px`,
    height: `${height}px`,
  }

  // Save width & height dimension
  useEffect(
    () => {
      if (ref.current && ref.current.getBoundingClientRect().width) {
        setWidth(ref.current.getBoundingClientRect().width)
      }
      if (ref.current && ref.current.getBoundingClientRect().height) {
        setHeight(ref.current.getBoundingClientRect().height)
      }
    },
    // children are a dep so dimensions are updated if initial contents change
    [children]
  )

  return (
    <button
      style={width && height ? fixButtonDimension : style}
      ref={ref}
      className={classNamesCombined([buttonClass, className])}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading === true ? 'loading...' : children}
    </button>
  )
}

export default Button
