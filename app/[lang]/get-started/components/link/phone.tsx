import React from 'react'
import { getLang } from 'helpers/country'
// import { PhoneIcon } from 'images'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// import Image from 'next/image'
import styles from '../../index.module.scss'
interface IProps {
  lang: any
  isModal: boolean
  handleClick?: () => void
}

const PhoneLink = (props: IProps) => {
  const langKey = getLang()
  const {
    lang: { newGetStarted },
    handleClick,
    isModal
  } = props
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('referral_code')
  const invitedSource = searchParams.get('invited_source')
  const loginPhone = () => {

    if (isModal) {
      handleClick()
    }
    else {
      if (referralCode && invitedSource) {
        router.push(`/${langKey}/get-started/phone?referral_code=${referralCode}&invited_source=${invitedSource}`)
      }
      else {
        router.push(`/${langKey}/get-started/phone` + window.location.search)
      }
    }
  }
  return (
    <li>
      <div className={styles.phoneBox} onClick={() => loginPhone()}>
        <i className='icon-phone'></i>
        {newGetStarted.phone}
      </div>
    </li>
  )
}

export default PhoneLink
