import { useEffect, useState } from 'react'

/* Components */
import PublicHeader from './PublicHeader'
import ProtectedHeader from './ProtectedHeader'

import { getCookie } from 'helpers/cookies'


const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(getCookie('accessToken') ? true : false)
  }, [])

  return (
    <div>
      {isAuthenticated && <ProtectedHeader />}
      {!isAuthenticated && <PublicHeader />}
    </div>
  )
}

export default Header
