'use client'
import React, { useState, useMemo } from 'react'
import styles from './index.module.scss'
import './index.scss'
const Containers = (props: any) => {
    console.log({props})
    const [inTouches, setIntouches] = useState(false)
    const [beginPosition, setBegginPosision] = useState(0)
    const [offset, setOffset] = useState(0)
    const [tab, setTab] = useState(1)
    const leftTouchTransitionX = useMemo(() => {
        const start = tab === 1 ? '0px' : '-50%'
        return `calc(${start} ${offset > 0 ? '+' : '-'} ${Math.abs(offset)}px)`
    }, [tab, offset])
    const rightTouchTransitionX = useMemo(() => {
        const start = tab !== 1 ? '0px' : '50%'
        return `calc(${start} ${offset > 0 ? '+' : '-'} ${Math.abs(offset)}px)`
    }, [tab, offset])
    const leftNormalTransitionX = useMemo(() => {
        return tab === 1 ? '0px' : '-50%'
    }, [tab])
    const rightNormalTransitionX = useMemo(() => {
        return tab !== 1 ? '0px' : '50%'
    }, [tab])
    const opacityRange = 300
    const leftTouchOpacity = useMemo(() => {
        if (tab !== 1) {
            if (Math.abs(offset) < opacityRange) {
                return Math.abs(offset) / opacityRange
            } else {
                return 0
            }
        } else {
            if (Math.abs(offset) < opacityRange) {
                return (opacityRange - Math.abs(offset)) / opacityRange
            } else {
                return 1
            }
        }
    }, [tab, offset])
    const rightTouchOpacity = useMemo(() => {
        if (tab === 1) {
            if (Math.abs(offset) < opacityRange) {
                return Math.abs(offset) / opacityRange
            } else {
                return 0
            }
        } else {
            if (Math.abs(offset) < opacityRange) {
                return (opacityRange - Math.abs(offset)) / opacityRange
            } else {
                return 1
            }
        }
    }, [tab, offset])
    const leftNormalOpacity = useMemo(() => {
        return tab === 1 ? 1 : 0
    }, [tab])
    const rightNormalOpacity = useMemo(() => {
        return tab !== 1 ? 1 : 0
    }, [tab])
    const touchesBegin = e => {
        // console.log('touchesBegin', e?.touches?.[0]?.clientX)
        const x = e?.touches?.[0]?.clientX
        setOffset(0)
        setIntouches(true)
        setBegginPosision(x)
    }
    const touchesEnd = e => {
        // console.log('touchesEnd', e?.touches?.[0]?.clientX)
        if (Math.abs((offset * 3) / opacityRange) > 1) {
            setTab(tab === 1 ? 2 : 1)
        }
        setIntouches(false)
    }
    const touchesMove = (e) => {
        // console.log('touchesMove', e?.touches?.[0]?.clientX)
        const x = e?.touches?.[0]?.clientX - beginPosition
        if (tab === 1 && (x > 0 || x < -opacityRange)) {
            return 0
        }
        if (tab !== 1 && (x < 0 || x > opacityRange)) {
            return 0
        }
        setOffset(x)
    }
    return <div className={styles.container}
        onTouchStart={touchesBegin}
        onTouchMove={touchesMove}
        onTouchEnd={touchesEnd}

    >
        <div
            className={styles.left}
            style={{
                transitionProperty: inTouches ? undefined : 'transform opcity',
                background: 'red',
                // transform: 'translateX(calc(0px - 50px))',
                transform: `translateX(${inTouches ? leftTouchTransitionX : leftNormalTransitionX})`,
                transitionTimingFunction: inTouches ? undefined : 'ease-out',
                transitionDuration: inTouches ? undefined : `${(0.002 * Math.abs(offset))}s`,
                opacity: inTouches ? leftTouchOpacity : leftNormalOpacity
            }}
        ></div>
        <div
            className={styles.right}
            style={{
                transitionProperty: inTouches ? undefined : 'transform opcity',
                background: 'yellow',
                // transform: 'translateX(calc(0px - 50px))',
                transform: `translateX(${inTouches ? rightTouchTransitionX : rightNormalTransitionX})`,
                transitionTimingFunction: inTouches ? undefined : 'ease-out',
                transitionDuration: inTouches ? undefined : `${(0.002 * Math.abs(offset))}s`,
                opacity: inTouches ? rightTouchOpacity : rightNormalOpacity
            }}
        ></div>
    </div>
}

export default Containers