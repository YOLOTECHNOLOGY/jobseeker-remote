'use client'
import React, { useState, useRef, useEffect } from 'react'
import Lottie from 'lottie-web'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'

const LeftBanner = () => {
  const container = useRef()
  const [displayVipImage, setDisplayVipImage] = useState(false)
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')
  useEffect(() => {
    if (referralCode && invitedSource) {
      setDisplayVipImage(true)
    }
    else {
      Lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('images/animation.json')
      })
    }

    return () => {
      Lottie?.destroy()
    }
  }, [])

  if (displayVipImage) {
    return (
      <div className={`${styles.bannner} ${styles.bannerFlex}`}>
        <div className={styles.bannerText}>
          <p>Get VIP Privileges Immediately
            <span>Invite New Users To Register</span>
          </p>
          <p>Bossjob AI
            <span>Resume Assistant</span>
          </p>
          <p>High Salary Offer
            <span>Help You Get</span>
          </p>
        </div>
        {/* <Image src={require('./getstarted_vip.png').default.src} width={400} height={610} alt="" /> */}
      </div>
    )
  }

  return <div ref={container} className={styles.bannner}></div>
}

export default LeftBanner
