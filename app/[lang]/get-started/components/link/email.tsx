import React from "react";
import Link from 'next/link'

import { EmailIcon } from 'images'
import { usePathname } from "next/navigation";

const EmailLink = ()=>{
  const pathname = usePathname()
  
  return (
    <li>
     <Link href={`${pathname}/email`}>
     <img src={EmailIcon}></img>
      Email
    </Link>
    </li>
  )
}

export default  EmailLink;