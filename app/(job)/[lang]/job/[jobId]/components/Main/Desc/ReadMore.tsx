'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../../page.module.scss'
interface Iprops {
  text: string
  line: number
  children?: React.ReactNode
  lineHeight: number
  expandText?: string
  shrinkText?: string
  [prop: string]: any
  isScroll?: {[key:string]: any}
}

const ReadMore = (props: Iprops) => {
  const {
    text,
    line = 5,
    lineHeight = 24,
    expandText = 'Read More',
    shrinkText = 'Read Less',
    isScroll,
    ...rest
  } = props
  const wrapEl = useRef(null)
  const [showReadMore, setReadMore] = useState(true)
  const [showMore, setMore] = useState(false)

  useEffect(() => {
    if (wrapEl) {
      const height = wrapEl.current.getBoundingClientRect().height
      setMore(() => height > lineHeight * line)
    }
  }, [wrapEl])

  const handleShowMore = () => {
    setReadMore((state) => !state)
    
    if (isScroll && !showReadMore) {
      window.scroll({top:0, left:0, behavior: "smooth", ...isScroll})
    }
  }

  return (
    <div ref={wrapEl}>
      <div
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          lineHeight: lineHeight + 'px',
          height: showMore ? (showReadMore ? lineHeight * line + 'px' : 'auto') : 'auto',
          overflow: showReadMore ? 'hidden' : 'auto'
        }}
        {...rest}
      />
      {showMore && (
        <div className={styles['read_more_container']} onClick={handleShowMore}>
          <div className={showReadMore ? styles['read_more_mask'] : ''}></div>
          <span className={styles['read_more_text']}>{showReadMore ? expandText : shrinkText}</span>
        </div>
      )}
    </div>
  )
}

export default ReadMore
