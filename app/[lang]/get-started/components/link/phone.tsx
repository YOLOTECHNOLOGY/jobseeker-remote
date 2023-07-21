import React from 'react'
import { getLang } from 'helpers/country'
// import { PhoneIcon } from 'images'
import { useRouter } from 'next/navigation'
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
  const loginPhone = () => {
    isModal ? handleClick() : router.push(`/${langKey}/get-started/phone`)
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
