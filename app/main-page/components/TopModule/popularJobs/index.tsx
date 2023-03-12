'use client'
import React, { useContext, useMemo } from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
import { LocationContext } from 'app/components/providers/locationProvier'
import { buildQuery } from 'app/main-page/helper'

const PopularJob = () => {
    const { location } = useContext(LocationContext)

    const tags = [
        'Java Developer',
        'Full Stack Engineer',
        'Web Developer',
        'Customer Service',
        'Accountant',
        'Sales Consultant']
    const querys = useMemo(() => {
        return tags.map(tag => buildQuery(location?.value, tag))
    }, [location, tags])
    return <div className={styles.container}>
        <label>Pupular jobs:</label>
        <div className={styles.tagContainer}>{tags.map((tag, index) => (
            <div key={tag} className={styles.tag}>
                <Link prefetch={false} href={querys[index]}>{tag}</Link>
            </div>
        ))}</div>
    </div>
}

export default PopularJob as any