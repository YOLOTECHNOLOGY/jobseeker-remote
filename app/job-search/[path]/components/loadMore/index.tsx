/* eslint-disable no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
// document.documentElement.clientHeight：可见区域高度。
// document.documentElement.scrollTop：滚动条滚动的距离。
// content.offsetHeight：元素的高度。
// content.offsetTop：元素顶部距离父容器顶部的高度。
const id = 'job-search-mobile-list-load-more'
const LoadMore = (props: any) => {
    const { currentPage } = props
    const [loadingPage, setLoadingPage] = useState(currentPage)
    useEffect(() => {
        const listener = e => {

            const loadMoreEle = document.getElementById(id)
            const offsetTop = loadMoreEle?.offsetTop
            const screenHeight = window.screen?.height
            const scrollTop = document.documentElement.scrollTop
            const isVisible = scrollTop + screenHeight - offsetTop > 0
            console.log({ isVisible, scrollTop, screenHeight, offsetTop })
        }

        window.addEventListener('scroll', listener, true)
        return window.removeEventListener('scroll', listener)
    }, [])
    return <div className={styles.container} id={id}>load more</div>
}

export default LoadMore