import React from "react";
import Link from 'next/link'
import {getLang } from 'helpers/country'

const EmailLink = ()=>{
  const langKey = getLang();
  return (
    <li>
     <Link href={`/${langKey}/get-started/email`}>
     <img src='https://dev.bossjob.ph/_next/image?url=https%3A%2F%2Fdev-assets.bossjob.com%2Fcompanies%2F31430%2Flogo%2Flogo.png&w=48&q=75'></img>
      Email
    </Link>
    </li>
  )
}

export default  EmailLink;