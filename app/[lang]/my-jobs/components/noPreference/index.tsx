import React from 'react'
import styles from './index.module.scss'
import { JoinUs } from 'images'
import Image from 'next/image'
import { Button } from 'app/[lang]/components/MUIs'
import Link from 'next/link'
const NoPreference = (props:any) => {
    return <div className={styles.container}>
        <Image src={JoinUs} width={362} height={247} alt='' />
        <Link
            href='/manage-profile?tab=job-preferences'
            className={styles.description}
            prefetch={false}
        >
            <Button
                variant='contained'
                style={{ textTransform: 'capitalize', borderRadius: 10 }}
            >{props?.lang?.addJobPreference} </Button>
        </Link>
    </div>
}

export default NoPreference