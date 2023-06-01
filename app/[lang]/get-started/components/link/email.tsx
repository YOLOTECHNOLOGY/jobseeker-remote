import React from "react";
import Link from 'next/link'
import {getLang } from 'helpers/country'
import { EmailIcon } from 'images'

interface IProps {
  lang: any;
}

const EmailLink = (props: IProps)=>{
  const { lang: {newGetStarted} } = props
  const langKey = getLang()

  return (
    <li>
     <Link href={`/${langKey}/get-started/email`}>
     <img src={EmailIcon}></img>
      {newGetStarted.email}
    </Link>
    </li>
  )
}

export default  EmailLink;