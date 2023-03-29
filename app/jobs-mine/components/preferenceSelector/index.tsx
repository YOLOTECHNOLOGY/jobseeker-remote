'use client'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
const PreferenceSelector = (props: any) => {
    const { preferences = [], preferenceId } = props

    return <div className={styles.container}>
        <div className={styles.title}>Desired Job Title:</div>
        <div className={styles.preferences}>
            {preferences.map(preference => {
                return <div
                    key={preference.id}
                    className={classNames({
                        [styles.preference]: true,
                        [styles.selected]: preferenceId === preference.id
                    })}>
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