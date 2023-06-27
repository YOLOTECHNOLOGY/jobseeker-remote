import { buildQuery } from 'app/(main-page)/helper'
import React from 'react'
import styles from './index.module.scss'
import Link from 'next/link'
const SearchHistories = (props: any) => {
    const { list = [], location } = props
    if (!list?.length) {
        return null
    }
    if (list.length > 10) {
        list.length = 10
    }
    return <div className={styles.container}>
        <div className={styles.title}>Related Search</div>
        {list.map(item => {
            return <Link
                key={item}
                href={buildQuery(location, item)}
                prefetch={true}
            >
                <div className={styles.item}>{item}</div>
            </Link>
        })}
    </div>
}

export default SearchHistories