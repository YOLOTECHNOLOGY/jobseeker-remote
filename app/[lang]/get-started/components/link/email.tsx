import React from 'react'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import { useSearchParams } from 'next/navigation'

// import { EmailIcon } from 'images'
// import Image from 'next/image'
import styles from '../../index.module.scss'
interface IProps {
  lang: any
  isModal: boolean
  handleClick?: () => void
}

const EmailLink = (props: IProps) => {
  const {
    lang: { newGetStarted },
    handleClick,
    isModal
  } = props
  const langKey = getLang()
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')
  const loginEmail = () => {
    if (isModal) {
      handleClick()
    }
    else {
      if (referralCode && invitedSource) {
        router.push(`/${langKey}/get-started/email?referral_code=${referralCode}&invited_source=${invitedSource}`)
      }
      else {
        router.push(`/${langKey}/get-started/email`)
      }
    }
  }

  return (
    <li>
      <div className={styles.phoneBox} onClick={() => loginEmail()}>
        <i className='icon-email'></i>
        {newGetStarted.email}
      </div>
    </li>
  )
}

export default EmailLink
