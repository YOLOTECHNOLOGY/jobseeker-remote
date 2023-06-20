import React from 'react'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import { EmailIcon } from 'images'

interface IProps {
  lang: any,
  isModal:boolean,
  handleClick?:()=>void
}

const EmailLink = (props: IProps) => {
  const {
    lang: { newGetStarted },
    handleClick,
    isModal
  } = props
  const langKey = getLang()
  const router = useRouter()

  const loginEmail = ()=>{
    isModal ? handleClick() : router.push(`/${langKey}/get-started/email`)
  }
  return (
    <li>
      <div onClick={()=>loginEmail()}> 
        <img src={EmailIcon}></img>
        {newGetStarted.email}
       </div>
    </li>
  )
}

export default EmailLink
