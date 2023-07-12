import React from 'react'
import { getLang } from 'helpers/country'
import { PhoneIcon } from 'images'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
      <div onClick={() => loginPhone()}>
        <Image src={PhoneIcon} alt='phone' width={24} height={24} />
        {newGetStarted.phone}
      </div>
    </li>
  )
}

export default PhoneLink
