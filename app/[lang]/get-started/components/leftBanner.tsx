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
  // useEffect(() => {
  //   if (referralCode && invitedSource) {
  //     setDisplayVipImage(true)
  //   } else {
  //     Lottie.loadAnimation({
  //       container: container.current,
  //       renderer: 'svg',
  //       loop: true,
  //       autoplay: true,
  //       name: 'animation.json',
  //       animationData: require('images/animation.json')
  //     })
  //   }

  //   return () => {
  //     Lottie?.destroy()
  //   }
  // }, [])

  useEffect(() => {
    let animation

    const loadAnimation = () => {
      animation = Lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: require('images/animation.json')
      })
    }

    if (referralCode && invitedSource) {
      setDisplayVipImage(true)
    } else {
      loadAnimation()

      if (container.current) {
        // 创建一个新的 ResizeObserver 实例
        const resizeObserver = new ResizeObserver(() => {
          // 当容器尺寸发生变化时，重新加载动画
          animation?.destroy()
          loadAnimation()
        })

        // 开始观察容器的尺寸变化
        resizeObserver.observe(container.current)

        // 在组件卸载时，停止观察容器的尺寸变化并销毁动画
        return () => {
          resizeObserver.disconnect()
          animation?.destroy()
        }
      }
    }
  }, [])

  if (displayVipImage) {
    return (
      <div className={`${styles.bannner} ${styles.bannerFlex}`}>
        <div className={styles.bannerText}>
          <p>
            {newGetStarted?.vipText.GetVipPrivilegesImmediately}
            <span>{newGetStarted?.vipText.InviteNewUsersToRegister}</span>
          </p>
          <p>
            {newGetStarted?.vipText.BossjobAI}
            <span>{newGetStarted?.vipText.ResumeAssistant}</span>
          </p>
          <p>
            {newGetStarted?.vipText.HighSalaryOffer}
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
