
'use client'
import React, { useRef, useLayoutEffect, useState } from 'react'
import classNames from "classnames"
import styles from './index.module.scss'
import { isContentOverflowing } from '../popover/MouseOverPopover'



const ScrollText = (props: any) => {
    const { className, children } = props
    const elRef = useRef<HTMLParagraphElement>(null);
    const [scroll, setScroll] = useState(false);
    const [duration, setDuration] = useState(5);
    useLayoutEffect(() => {
        if (elRef.current && isContentOverflowing(elRef.current)) {
            setScroll(true)
            setDuration(elRef.current.scrollWidth * 5 / 600)
        }
    }, [elRef, children])
    return <div {...props}
        style={{ '--i': `${duration}s` }}
        className={classNames(className, {
            [styles.scrollText]: scroll,

        })}>
        <p ref={elRef}>{children}</p>
    </div>
}

export default ScrollText