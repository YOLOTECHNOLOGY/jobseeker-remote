'use client'
import React, { useState, useRef, useEffect } from 'react'
import Lottie from 'lottie-web'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'

const LeftBanner = ({ newGetStarted }) => {
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
          <p>{newGetStarted?.vipText.GetVipPrivilegesImmediately}
            <span>{newGetStarted?.vipText.InviteNewUsersToRegister}</span>
          </p>
          <p>{newGetStarted?.vipText.BossjobAI}
            <span>{newGetStarted?.vipText.ResumeAssistant}</span>
          </p>
          <p>{newGetStarted?.vipText.HighSalaryOffer}
            <span>{newGetStarted?.vipText.HelpYouGet}</span>
          </p>
        </div>
        {/* <Image src={require('./getstarted_vip.png').default.src} width={400} height={610} alt="" /> */}
      </div>
    )
  }

  return <div ref={container} className={styles.bannner}></div>
}

export default LeftBanner
