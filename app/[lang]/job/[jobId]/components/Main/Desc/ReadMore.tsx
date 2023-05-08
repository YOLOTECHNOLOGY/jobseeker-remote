"use client"
import React, {useEffect, useRef, useState} from 'react'
import styles from '../../../page.module.scss'
interface Iprops {
    text: string;
    line: number;
    children?: React.ReactNode;
    lineHeight: number;
    [prop: string]: any;
}

const ReadMore = (props: Iprops) => {
    const { text, line=5, lineHeight=24, ...rest } = props
    const wrapEl = useRef(null)
    const [showReadMore, setReadMore] = useState(true)
    const [showMore, setMore] = useState(false)

    useEffect(() => {
        if(wrapEl){
            const height = wrapEl.current.getBoundingClientRect().height
            setMore(() => height > lineHeight * line)
        }
    }, [wrapEl])

    const handleShowMore = () => {
        setReadMore((state) => !state)
    }

    return (
        <div ref={wrapEl}>
            <div
                dangerouslySetInnerHTML={{ __html: text }} 
                style={{
                    lineHeight: lineHeight+'px',
                    height: showMore ? (showReadMore? lineHeight*line+'px' : 'auto'): 'auto',
                    overflow: showReadMore? 'hidden' : 'auto'
                }}
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
