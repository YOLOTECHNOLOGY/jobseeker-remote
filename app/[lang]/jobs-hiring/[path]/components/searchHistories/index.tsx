import { buildQuery } from 'app/[lang]/main-page/helper'
import React from 'react'
import styles from '../../index.module.scss'
import Link from 'next/link'
const SearchHistories = (props: any) => {
    const { list = [], location,lang } = props
    if (!list?.length) {
        return null
    }
    if (list.length > 10) {
        list.length = 10
    }
    return <div className={styles.histories}>
        <div className={styles.title}>{lang.relatedSearch}</div>
        {list.map(item => {
            return <Link
            className={styles.item}
                key={item}
                href={buildQuery(location, item)}
                prefetch={true}
            >
               {item.value}
            </Link>
        })}
    </div>
}

export default SearchHistories