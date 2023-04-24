"use client"
import React, {useEffect, useRef, useState} from 'react'
import classNames from 'classnames';
import styles from '../../../page.module.scss'
interface Iprops {
    text: string;
    line: number;
    children?: React.ReactNode;
    className: string;
    lineHeight: number;
    [prop: string]: any;
}

const ReadMore = (props: Iprops) => {
    const wrapEl = useRef(null)
    const [showReadMore, setReadMore] = useState(true)
    const [showMore, setMore] = useState(false)
    const { text, line=2, lineHeight=24, className, ...rest } = props

    useEffect(() => {
        if(wrapEl){
            const height = wrapEl.current.getBoundingClientRect().height
            setMore(() => height > lineHeight * line)
        }
    }, [wrapEl])

    const lineClampStyle  = {
        '--line-clamp': line,
        'line-height': lineHeight
    }

    const handleShowMore = () => {
        setReadMore((state) => !state)
    }

    return (
        <div ref={wrapEl}>
            <div
                dangerouslySetInnerHTML={{ __html: text }} 
                className={classNames([className, showReadMore?styles['lines_camp']:''])}
                style={lineClampStyle as any}
                {...rest}
            />
            {
                showMore && <div 
                className={styles['read_more_container']} 
                onClick={handleShowMore}
                >
                    {showReadMore ? 'Read More': 'Read Less'}
                </div>
            }
        </div>
    )
}

export default ReadMore
