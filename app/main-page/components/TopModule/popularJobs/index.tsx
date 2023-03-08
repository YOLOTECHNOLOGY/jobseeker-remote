//
import React from 'react'
import Link from 'next/link'
import slugify from 'slugify'
import styles from './index.module.scss'

const PopularJob : any = async (props: any) => {
    console.log({ props })
    const tags = await Promise.resolve([
        'Java Developer',
        'Full Stack Engineer',
        'Web Developer',
        'Customer Service',
        'Accountant',
        'Sales Consultant'])
    return <div className={styles.container}>
        <label>Pupular jobs:</label>
        {tags.map(tag => (
            <div key={tag} className={styles.tag}>
                <Link prefetch={true} href={`/jobs-hiring/${slugify(tag).toLowerCase()}-jobs`}>{tag}</Link>
            </div>
        ))}
    </div>
}

export default PopularJob