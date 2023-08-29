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
const VipActivity = ({ accessToken }) => {
  const [referralCode, setReferralCode] = useState('')
  const [vipModal, setVipModal] = useState(false)

  useEffect(() => {

    accessToken && fetchUserOwnDetailService({ accessToken }).then(res => {
      if (res?.data?.data) {
        setReferralCode(res.data.data.referral_code)
      }
    })
  }, [accessToken])

  return (
    <>
      <div className={styles.vipImage} onClick={() => setVipModal(true)}>
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
    </>

  )
}
const VipShareModal = ({ referral_code, lang, handleCloseModal }) => {
  const copyTextRef = useRef(null)

  return (
    <div className={styles.vipShareWrapper}>
      <div className={styles.vipShareModal}>
        <img className={styles.close} src={CloseIcon} alt="" width="17" height="17" onClick={(handleCloseModal)} />
        <h1>INVITE FRIENDS TO GET <span style={{ color: '#004AFF' }}>AI RESUME COACHING</span></h1>
        <h3>Invite A friends to register with Bossjob and get VIP immediately</h3>
        <div className={styles.main}>
          <div className={styles.left}>
            <p>High-quality VIP resume template and AI  assistant <br /> to help you get high-paying Offer</p>
            <img src={require('./share_modal_image.png').default.src} alt="" />
          </div>
          <div className={styles.right}>
            <p className={styles.description}>Instant access to VIP privileges for invitees and invitees</p>
            <div className={styles.featureContent}>
              <p>
                <Image src={require('./vip_share_icon1.svg').default.src} width={26} height={26} alt="add"></Image>
                Share registration
                login link
              </p>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold'
              }}>&gt;</span>
              <p>
                < Image src={require('./vip_share_icon2.svg').default.src} width={26} height={26} alt="add"></Image>
                new user registration automatically get VIP
              </p>
            </div>
            <p className={styles.links} ref={copyTextRef}>
              <a href={`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`} target="_blank">
                {`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`}
              </a>
            </p>
            <Button
              variant="contained"
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(copyTextRef.current.innerText)
              }}
            >
              Copy link to invite now
            </Button>
          </div>
        </div>
      </div>

    </div >
  )
}
export default VipActivity