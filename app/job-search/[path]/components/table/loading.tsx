import React from 'react'
import styles from './index.module.scss'

const Loading = (props: any) => {
    const rects = new Array(15).fill('')
    console.log({ tableProps: props })
    return <div className={styles.container}>
        {rects.map((_, index) => {
            return (<rect className={styles.jobContainer} key={index}>
            </rect>)
        })}
    </div>
}

export default Loading