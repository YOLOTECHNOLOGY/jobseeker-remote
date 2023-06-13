import React, { useState, useRef, useLayoutEffect } from 'react'

/* Vendors */
import classNames from 'classnames/bind'

/* Assets */
import styles from './Accordian.module.scss'

/* Constant */
import { Plus, Minus, ChevronUpIcon, ChevronDownIcon } from 'images'
import LazyLoad from '../LazyLoad'

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
  dark?: boolean
}

const darkExpand = require('./expand.svg').default.src;
const darkkShrink = require('./shrink.svg').default.src;


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
  dark,
  ...rest
}: AccordianProps) => {
  const [isVisible, setIsVisible] = useState(defaultOpenState)
  const [contentHeight, setContentHeight] = useState(0);

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
  const contentRef = useRef(null);


  const calculateContentHeight = () => {
    setContentHeight(contentRef.current.scrollHeight);
  };
  useLayoutEffect(() => {
    calculateContentHeight();
  });
  return (
    <div className={accordianClass} style={style} {...rest}>
      <div className={titleClasses} onClick={handleClick}>
        <span>{title}</span>
        <div className={styles.accordianToggleIcon}>
          {isVisible ? (
              <img src={dark ? darkkShrink : closeIcon} title='minus' alt='minus' height='16' width='16' />
          ) : (
              <img src={dark ? darkExpand  : openIcon} title='Plus' alt='Plus' height='16' width='16' />
          )}
        </div>
      </div>
      <div className={contentClasses} style={{overflow: "hidden", height: isVisible ? contentHeight + 'px' : '0px'}}>
        <div
          className={`${contentClasses} ${
            isVisible ? styles.accordianVisible : styles.accordianHidden
          }`}

          ref={contentRef}
        >
          {children}
        </div>
      </div>

    </div>
  )
}

export default Accordian
