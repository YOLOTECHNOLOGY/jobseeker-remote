'use client'
import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'
import styles from './index.module.scss'

const ExcellentResumeBanner = () => {
  const container = useRef()

  useEffect(() => {
    alert('')
    Lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./excellentResume.json')
    })
    return () => {
      Lottie.destroy()
    }
  }, [])

  const handleClick = () => {
    window.open('https://aicv.bossjob.com/', '_blank')
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div ref={container}></div>
      <span style={{ fontSize: '26px' }}>excellent resume</span>
      <span style={{ fontSize: '18px' }}>open the door to success</span>
      <span className={styles.button}>Create My resume</span>
    </div>
  )
}
export default ExcellentResumeBanner