import React from "react";
import Link from 'next/link'

import { PhoneIcon } from 'images'
import { usePathname } from "next/navigation";

interface IProps {
  lang?: any;
}

const PhoneLink = (props: IProps)=>{
  const pathname = usePathname()
  const { lang: {newGetStarted} } = props
  return (
    <li>
     <Link href={`${pathname}/phone`}>
     <img src={PhoneIcon}></img>
      {newGetStarted.phone}
    </Link>
    </li>
  )
}

export default  PhoneLink;