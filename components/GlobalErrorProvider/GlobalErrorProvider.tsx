import dynamic from 'next/dynamic'
import React from 'react'
import { useSelector } from 'react-redux'
const GlobalNotificationBar = dynamic(() => import('../GlobalNotificationBar'))

type GlobalErrorProviderProps = {
  children: React.ReactNode
}

const GlobalErrorProvider = ({ children }: GlobalErrorProviderProps) => {
  const error = useSelector((store: any) => store.error.globalError.error)
  return (
        <>
            {children}
            {error && <GlobalNotificationBar message={error.message} />}
        </>
  )
}

export default GlobalErrorProvider
