import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
const NotificationBar = dynamic(() => import('../NotificationBar'))

const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  const notification = useSelector((store: any) => store.notificationbar.notification)
  return (
        <>
            {children}
            {notification?.open && <NotificationBar message={notification.message} severity={notification.severity}/>}
        </>
  )
}

export default NotificationProvider
