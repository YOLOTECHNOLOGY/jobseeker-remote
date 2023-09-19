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
import { useSelector } from 'react-redux'

import Toast from 'app/components/Toast'
const VipActivity = ({ newGetStarted, accessToken, handleCloseModal }) => {
  // const [referralCode, setReferralCode] = useState('')
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail.response)


  // useEffect(() => {

  //   accessToken && fetchUserOwnDetailService({ accessToken }).then(res => {
  //     if (res?.data?.data) {
  //       setReferralCode(res.data.data.referral_code)
  //     }
  //   })

  // }, [accessToken])

  return (

    <VipShareModal
      referral_code={userDetail.referral_code}
      lang={getLang()}
      newGetStarted={newGetStarted}
      // host={getResumeTemplateHostRef.current}
      handleCloseModal={handleCloseModal} />

  )
}
const VipShareModal = ({ referral_code, lang, newGetStarted, handleCloseModal }) => {
  const copyTextRef = useRef(null)
  return (
    <div className={styles.vipShareWrapper}>
      <div className={styles.vipShareModal}>
        <img className={styles.close} src={require('./icon_close.svg').default.src} alt="" width="15" height="15" onClick={handleCloseModal} />
        <div className={styles.main}>
          <div className={styles.left}>
            <p className={styles.buttonText}>{newGetStarted.vipText.inviteFriendsToGet}</p>
            <p className={styles.blueText}>{newGetStarted.vipText.AIResumeCoaching}</p>
            <p className={styles.descText}>{newGetStarted.vipText.HighQualityVIPResumeTemplateAndAIAssistantToHelpYouGetHighPayingOffer}</p>
            <p className={styles.links} ref={copyTextRef}>
              {`${location.origin}/${lang}/get-started?referral_code=${referral_code}&invited_source=resume_template`}
            </p>
            <Button
              variant="contained"
              className={styles.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(copyTextRef.current.innerText)
                Toast.success('Link copied success!')
              }}
            >
              <img src={require('./icon_copy_arrow.svg').default.src} alt="" style={{ marginRight: '20px' }} />{newGetStarted.vipText.copyLinkToInviteNow}
            </Button>
          </div>
          <div className={styles.right}></div>
        </div>
      </div>
    </div>
  )
}
export default VipActivity