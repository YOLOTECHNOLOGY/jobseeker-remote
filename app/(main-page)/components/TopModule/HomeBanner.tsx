'use client'
import React, { useRef, useEffect } from 'react'
import Lottie from 'lottie-web'
import styles from '../../../index.module.scss'

const HomeBanner = () => {
  const container = useRef()

  useEffect(() => {
    Lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('images/homebanner.json')
    })

    return () => {
      Lottie.destroy()
    }
  }, [])

  return <div className={styles.searchBackground} ref={container} />
}

export default HomeBanner
