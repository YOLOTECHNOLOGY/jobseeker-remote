'use client'

import { receiveNotification } from 'bossjob-remote/dist/clientStorage'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
const InProviders = () => {
    const dispatch = useDispatch()
    // receive remote module notifications
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const revoke = [receiveNotification('ROUTE_PUSH', data => {
                router.push(data.note)
            }),
            receiveNotification('SYSTEM_NOTETIFICATION', async data => {
                dispatch(displayNotification(data.note))
            })
            ].reduce((prev, curr) => () => {
                prev?.()
                curr?.()
                // eslint-disable-next-line @typescript-eslint/no-empty-function
            }, () => { })

            return () => revoke?.()
        }
    }, [])
    return <></>
}
export default InProviders