'use client'
import { useEffect, useState,useContext} from 'react'
import { useSelector } from 'react-redux'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
/* Components */
import PublicHeader from './PublicHeader'
import ProtectedHeader from './ProtectedHeader'

import { getCookie } from 'helpers/cookies'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const data : any = useContext(languageContext)

  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [userDetail])

  return (
    <div>
      {isAuthenticated && <ProtectedHeader LG={data.header}/>}
      {!isAuthenticated && <PublicHeader LG={data.header}/>}
    </div>
  )
}

export default Header
