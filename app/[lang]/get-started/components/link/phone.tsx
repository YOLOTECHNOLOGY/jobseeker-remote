import React from 'react'
import { getLang } from 'helpers/country'
import { PhoneIcon } from 'images'
import { useRouter } from 'next/navigation'
interface IProps {
  lang: any,
  isModal:boolean,
  handleClick?:()=>void
}

const PhoneLink = (props: IProps) => {
  const langKey = getLang()
  const {
    lang: { newGetStarted },
    handleClick,
    isModal
  } = props
  const router = useRouter()
  const loginPhone = ()=>{
    isModal ? handleClick() : router.push(`/${langKey}/get-started/phone`)
  }
  return (
    <li>
      <div onClick={()=>loginPhone()}>
        <img src={PhoneIcon}></img>
        {newGetStarted.phone}
      </div>
    </li>
  )
}

export default PhoneLink
