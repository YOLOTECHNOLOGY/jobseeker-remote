import React, { useState } from 'react'

/* Vendors */
import classNames from 'classnames/bind'

/* Assets */
import styles from './Accordian.module.scss'

/* Constant */
import { Plus, Minus, ChevronUpIcon, ChevronDownIcon } from 'images'

const cx = classNames.bind(styles)

interface AccordianProps {
  title?: string | React.ReactNode
  children: React.ReactNode
  className?: string
  style?: object
  paddedLine?: boolean
  paddedContent?: boolean
  scrollableContent?: boolean
  chevronIcon?: boolean
  defaultOpenState?: boolean
  isNotCollapsible?: boolean
}

const Accordian = ({
  title,
  children,
  className,
  style,
  paddedLine,
  paddedContent,
  scrollableContent,
  chevronIcon,
  defaultOpenState = false,
  isNotCollapsible = false,
  ...rest
}: AccordianProps) => {
  const [isVisible, setIsVisible] = useState(defaultOpenState)

  const handleClick = () => {
    if (!isNotCollapsible) setIsVisible(!isVisible)
  }

  const componentClass = {
    accordian: true,
  }
  const titleClass = {
    accordianPaddedLine: paddedLine,
    accordianTitle: true,
  }
  const contentClass = {
    accordianContent: paddedContent,
    accordianContentScroll: scrollableContent,
  }
  const accordianClass = cx([componentClass, className])
  const contentClasses = cx([contentClass])
  const titleClasses = cx([titleClass])

  const openIcon = chevronIcon ? ChevronDownIcon : Plus
  const closeIcon = chevronIcon ? ChevronUpIcon : Minus

  return (
    <div className={accordianClass} style={style} {...rest}>
      <div className={titleClasses} onClick={handleClick}>
        <span>{title}</span>
        <div className={styles.accordianToggleIcon}>
          {isVisible ? (
            <img src={closeIcon} title='minus' alt='minus' height='16' width='16' />
          ) : (
            <img src={openIcon} title='Plus' alt='Plus' height='16' width='16' />
          )}
        </div>
      </div>
      <div
        className={`${contentClasses} ${
          isVisible ? styles.accordianVisible : styles.accordianHidden
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default Accordian
