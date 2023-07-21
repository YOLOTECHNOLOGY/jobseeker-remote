import React from 'react'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
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

  const loginEmail = () => {
    isModal ? handleClick() : router.push(`/${langKey}/get-started/email`)
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
