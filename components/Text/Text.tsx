import React from 'react'

/* Vendors */
import classNames from 'classnames/bind'

/* Assets */
import styles from './Text.module.scss'

interface TextProps {
  children: React.ReactNode
  // children:  string | React.ReactElement |React.ReactElement []
  // children:  string | JSX.Element | JSX.Element[];
  style?: React.CSSProperties
  className?: string
  tagName?: keyof JSX.IntrinsicElements
  bold?: boolean
  italic?: boolean
  textColor?: string
  textStyle?: string
  block?: boolean
  onClick?: () => void
  underline?: boolean
  // enableUnescape?: boolean
}

const Text = ({
  bold,
  italic,
  style,
  className,
  children,
  tagName: TagName,
  textStyle,
  textColor = 'black',
  block,
  underline,
  // enableUnescape,
  ...rest
}: TextProps) => {
  const componentClass = {
    text: true,
    textBold: bold,
    textItalic: italic,
    textUnderline: underline,
    textXSM: textStyle === 'xsm',
    textSM: textStyle === 'sm',
    textBase: textStyle === 'base',
    textLG: textStyle === 'lg',
    textXL: textStyle === 'xl',
    textXXL: textStyle === 'xxl',
    textXXXL: textStyle === 'xxxl',
    textH1: TagName === 'h1',
    textH2: TagName === 'h2',
    textH3: TagName === 'h3',
    textH4: TagName === 'h4',
    textH5: TagName === 'h5',
    textP: TagName === 'p',
    textSpan: TagName === 'span',
    textBlock: block,
    textWhite: textColor === 'white',
    textPrimaryBlue: textColor === 'primaryBlue',
    textLightgrey: textColor === 'lightgrey',
    textDarkgrey: textColor === 'darkgrey',
    textBlack: textColor === 'black',
    textRed: textColor === 'red'
  }
  const cx = classNames.bind(styles)
  const textClass = cx([componentClass, className])
  const Tag = `${TagName}` as keyof JSX.IntrinsicElements
  return (
    <Tag style={style} className={textClass} {...rest}>
      {children}
      {/* {enableUnescape ? unescape(children) : children} */}
    </Tag>
  )
}

Text.defaultProps = {
  tagName: 'span'
}

export default Text
