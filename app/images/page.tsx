import React from 'react'
import Image from 'next/image'
import * as images from 'images'
import styles from './index.module.scss'

const Images = () => {
    return <div className={styles.container}>
            { Object.keys(images).map(key => {
                const value = images[key]
                return <div key={key} className={styles.item}>
                        <Image className={styles.image} src={value} width={40} height={40} alt=''/>
                        <div className={styles.title}>{key}</div>
                </div>
            })

            }

    </div>
}

export default Images