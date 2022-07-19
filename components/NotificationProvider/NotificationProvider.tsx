import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
const NotificationBar = dynamic(() => import('../NotificationBar'))

type NotificationProviderProps = {
  children: React.ReactNode
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const notification = useSelector((store: any) => store.notificationbar.notification)
  return (
        <>
            {children}
            {notification?.open && <NotificationBar message={notification.message} severity={notification.severity}/>}
        </>
  )
}

export default NotificationProvider
