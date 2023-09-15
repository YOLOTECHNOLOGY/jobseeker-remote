'use client'
import React, { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'
import styles from './index.module.scss'
import { pushToResume } from 'helpers/push'
const ExcellentResumeBanner = ({ advertisingLink }) => {
  const container = useRef()

  useEffect(() => {
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
    // window.open(`${process.env.AICV_HOST}`, '_blank')
    pushToResume()

  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div ref={container}></div>
      <span style={{ fontSize: '26px', marginBottom: '10px', textAlign: 'center', lineHeight: 1 }}>{advertisingLink.excellentResume}</span>
      <span style={{ fontSize: '18px' }}>{advertisingLink.openTheDoorToSuccess}</span>
      <span className={styles.button}>{advertisingLink.createMyResume}</span>
    </div>
  )
}
export default ExcellentResumeBanner