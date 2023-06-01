import React from "react";
import Link from 'next/link'

import { PhoneIcon } from 'images'
import { usePathname } from "next/navigation";

const PhoneLink = ()=>{
  const pathname = usePathname()

  return (
    <li>
     <Link href={`${pathname}/phone`}>
     <img src={PhoneIcon}></img>
      Phone
    </Link>
    </li>
  )
}

export default  PhoneLink;