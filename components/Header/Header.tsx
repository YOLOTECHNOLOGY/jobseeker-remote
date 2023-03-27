'use client'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

/* Components */
import PublicHeader from './PublicHeader'
import ProtectedHeader from './ProtectedHeader'

import { getCookie } from 'helpers/cookies'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})

  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [userDetail])

  return (
    <div>
      {isAuthenticated && <ProtectedHeader />}
      {!isAuthenticated && <PublicHeader />}
    </div>
  )
}

export default Header
