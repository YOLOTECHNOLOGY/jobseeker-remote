
'use client'
import React from 'react'
import classNames from "classnames"
import styles from './index.module.scss'
const ScrollText = (props: any) => {
    const { className, children } = props
    return <div {...props} className={classNames(className, styles.scrollText)} >
        <p>{children}</p>
    </div>
}

export default ScrollText