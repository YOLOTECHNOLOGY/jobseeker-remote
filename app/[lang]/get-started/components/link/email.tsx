import React from "react";
import Link from 'next/link'

import { EmailIcon } from 'images'
import { usePathname } from "next/navigation";

interface IProps {
  lang: any;
}

const EmailLink = (props: IProps)=>{
  const { lang: {newGetStarted} } = props

  const pathname = usePathname()
  return (
    <li>
     <Link href={`${pathname}/email`}>
     <img src={EmailIcon}></img>
      {newGetStarted.email}
    </Link>
    </li>
  )
}

export default  EmailLink;