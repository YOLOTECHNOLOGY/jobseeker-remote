import React from 'react'
import styles from './index.module.scss'
import { JoinUs } from 'images'
import Image from 'next/image'
import { Button } from 'app/components/MUIs'
const NoPreference = () => {
    return <div className={styles.container}>
        <Image src={JoinUs} width={362} height={247} alt='' />
        <div className={styles.description}>
            <Button>Add job Preference </Button>
        </div>
    </div>
}

export default NoPreference