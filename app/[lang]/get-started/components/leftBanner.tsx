import React, { useRef, useEffect } from 'react'
import Lottie from 'lottie-web'
import styles from '../index.module.scss'
const LeftBanner = () => {
  const container = useRef()
  useEffect(() => {
    Lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('images/animation.json')
    })

    return () => {
      Lottie.destroy()
    }
  }, [])

  return <div ref={container} className={styles.bannner}></div>
}

export default LeftBanner
