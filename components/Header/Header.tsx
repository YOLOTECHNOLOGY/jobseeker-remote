'use client'
import { useEffect, useState, useContext } from 'react'
import { useSelector } from 'react-redux'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
import {useRouter} from 'next/router'
/* Components */
import PublicHeader from './PublicHeader'
import ProtectedHeader from './ProtectedHeader'

import { getCookie } from 'helpers/cookies'
import React from 'react'
import { usePathname } from 'next/navigation'
import LandingHeader from "./LandingPageHeader";

const Header = (props: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const contextLang = useContext(languageContext)
  const data: any = props.lang ?? contextLang
  const pathname = usePathname();
  
  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [userDetail])

  if(pathname.endsWith('/talents')){
    return <LandingHeader lang={data.header}/>
  }
  
  return (
    <div>
      {isAuthenticated && <ProtectedHeader lang={data.header} />}
      {!isAuthenticated && <PublicHeader lang={data.header} />}
    </div>
  )
}

export default Header
