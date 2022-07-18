import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
const GlobalNotificationBar = dynamic(() => import('../GlobalNotificationBar'))

type GlobalNotificationProviderProps = {
  children: React.ReactNode
}

const GlobalNotificationProvider = ({ children }: GlobalNotificationProviderProps) => {
  const notification = useSelector((store: any) => store.notificationbar.notification)
  return (
        <>
            {children}
            {notification?.open && <GlobalNotificationBar message={notification.message} severity={notification.severity}/>}
        </>
  )
}

export default GlobalNotificationProvider
