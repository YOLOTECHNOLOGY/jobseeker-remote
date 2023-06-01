import React from "react";
import Link from 'next/link'
import {getLang } from 'helpers/country'
import { PhoneIcon } from 'images'
interface IProps {
  lang: any;
}

const PhoneLink = (props: IProps)=>{
  const langKey = getLang()
  const { lang: {newGetStarted} } = props
  return (
    <li>
     <Link href={`/${langKey}/get-started/phone`}>
     <img src={PhoneIcon}></img>
      {newGetStarted.phone}
    </Link>
    </li>
  )
}

export default  PhoneLink;