import React from 'react'
import styles from './index.module.scss'
import Image from 'next/image'
import { cookies } from 'next/headers'
import Containers from './containers'
const MobileHeader = () => {
    const userInfo = JSON.parse(cookies().get('user')?.value)
    console.log({ userInfo })
    return <div className={styles.container}>
        <div className={styles.avatar}>
            <Image src={userInfo.avatar} height={50} width={50} alt='' />
        </div>
        <div className={styles.useName}>
            {[userInfo.first_name, userInfo.last_name].filter(a => a).join(' ')}
        </div>
        <Containers />
    </div>
}
export default MobileHeader