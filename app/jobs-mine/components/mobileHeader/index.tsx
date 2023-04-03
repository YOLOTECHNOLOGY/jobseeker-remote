import React, { Suspense } from 'react'
import styles from './index.module.scss'
import Image from 'next/image'
import { cookies } from 'next/headers'
import Containers from './containers'
import { fetchPersonalInfo } from 'store/services/jobs/fetchJobsCommunicated'
import Link from 'next/link'

const Item = (props: any) => {
    const { title, content, type } = props
    return <Link prefetch={false} href={'jobs-mine/communicated?type=' + type} className={styles.item}>
        <div className={styles.itemContent}>{content}</div>
        <div className={styles.itemTitle}>{title}</div>
    </Link>
}

const ServerContainer = async () => {
    const accessToken = cookies().get('accessToken')?.value
    const numbers = await fetchPersonalInfo({ accessToken })
        .then(res => res?.data?.data || {})
    const {
        no_of_applied_jobs,
        no_of_chats,
        no_of_interviews,
        no_of_saved_jobs,
        no_of_viewed_jobs,
    } = numbers

    const firstList = [
        { title: 'Communicated', content: no_of_chats, type: 'communicated' },
        { title: 'Exchanged', content: no_of_applied_jobs, type: 'exchanged' },
        { title: 'Saved', content: no_of_saved_jobs, type: 'saved' },
        { title: 'Interview', content: no_of_interviews, type: 'interview' },
    ]
    const secondList = [
        { title: 'Interested in me', content: '- -', type: 'interested' },
        { title: 'Who viewed me', content: no_of_viewed_jobs, type: 'viewed' },
    ]
    return <Containers
        first={firstList.map(data => <Item {...data} key={data.title} />)}
        second={secondList.map(data => <Item {...data} key={data.title} />)}
    />
}

const MobileHeader = () => {
    const userInfo = JSON.parse(cookies().get('user')?.value)

    return <div className={styles.container}>
        <div className={styles.avatar}>
            <Image src={userInfo.avatar} height={50} width={50} alt='' />
        </div>
        <div className={styles.useName}>
            {[userInfo.first_name, userInfo.last_name].filter(a => a).join(' ')}
        </div>
        <Suspense fallback={null}>
            {/* @ts-expect-error Async Server Component */}
            <ServerContainer />
        </Suspense>
    </div>
}
export default MobileHeader