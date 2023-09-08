'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@mui/material'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import { getLang } from 'helpers/country'
import styles from './index.module.scss'
import Image from 'next/image'
import {
  CloseIcon
} from 'images'
import DialogLogin from 'app/components/LoginDialog'
import Toast from 'app/components/Toast'

const VipActivity = ({ accessToken }) => {
  const [referralCode, setReferralCode] = useState('')
  const [vipModal, setVipModal] = useState(false)
  const [loginModal, setLoginModal] = useState(false)

  useEffect(() => {

    accessToken && fetchUserOwnDetailService({ accessToken }).then(res => {
      if (res?.data?.data) {
        setReferralCode(res.data.data.referral_code)
      }
    })
  }, [accessToken])


  const handleVipModalClick = () => {
    if (accessToken) {
      setVipModal(true)
    }
    else {
      setLoginModal(true)
    }
  }


  return (
    <>
      <div className={styles.vipImage} onClick={handleVipModalClick}>
        <Button
          variant='contained'
          className={styles.btn}
        >
          Get VIP for free
        </Button>
        <span className={styles.desc}>Invite friends to get AI resume coaching</span>
        <Image
          src={require('./vip_activity_image.png').default.src}
          width={514}
          height={268}
          alt="vip_activity_image"
          className={styles.image}
        />

      </div>
      {vipModal && <VipShareModal
        referral_code={referralCode}
        lang={getLang()}
        // host={getResumeTemplateHostRef.current}
        handleCloseModal={() => setVipModal(false)} />}
      {loginModal && <DialogLogin open={loginModal} handleClose={() => setLoginModal(false)} />}
    </>

  )
}
const VipShareModal = ({ referral_code, lang, handleCloseModal }) => {
  const copyTextRef = useRef(null)
  return (
    <div className={styles.vipShareWrapper}>
      <div className={styles.vipShareModal}>
        <img className={styles.close} src={require('./icon_close.svg').default.src} alt="" width="15" height="15" onClick={handleCloseModal} />
        <div className={styles.main}>
          <div className={styles.left}>
            <p className={styles.buttonText}>Invite Friends To Get</p>
            <p className={styles.blueText}>AI RESUME COACHING</p>
            <p className={styles.descText}>High-quality VIP resume template and AI  assistant to help you get high-paying Offer.</p>
            <p className={styles.links} ref={copyTextRef}>
              <a href={`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`} target="_blank">{`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`}</a>
            </p>
            <Button
              variant="contained"
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(copyTextRef.current.innerText)
                Toast.success('Link copied success!')
              }}
            >
              <img src={require('./icon_copy_arrow.svg').default.src} alt="" style={{ marginRight: '20px' }} />Copy link to invite now
            </Button>
          </div>
          <div className={styles.right}></div>
        </div>
      </div>
    </div>
  )
}
export default VipActivity