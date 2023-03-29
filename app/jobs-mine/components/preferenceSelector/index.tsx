'use client'
import React from 'react'
import styles from './index.module.scss'
const PreferenceSelector = (props: any) => {
    const { preferences = [] } = props
    return <div className={styles.container}>
        <div className={styles.title}>Desired Job Title:</div>
        <div className={styles.preferences}>
            {preferences.map(preference => {
                return <div
                    key={preference.id}
                    className={styles.preference}>
                    {preference.function_job_title}
                </div>
            })}
        </div>
        <div className={styles.action}>
            Add New
        </div>
    </div>
}

export default PreferenceSelector