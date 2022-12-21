import React, { useMemo } from 'react'
import styles from './index.module.scss'
const InterviewDetail = (props: any) => {
    const { data = {}, status } = props
    const detailData = useMemo(() => {
        const base = [
            ...[
                ['Job Title', data?.job_title],
                ['Job Position', data?.job_location],
                ['Location', data?.address],
                ['Date,Time', data.interviewed_at],
                ['Contact person', data?.contact_person],
                ['Contact number', data?.contact_person_contact_num],
                ['Instructions', data?.instruction]
            ],
            ...(status ? [['Status', status]] : [])
        ]
        if (data?.cancelled_reason) {
            base.push(['Cancel reason', data.cancelled_reason])
        }
        return base
    }, [data])
    return <div className={styles.modalContainer}>
        <div className={styles.formContainer}>
            {detailData.map(([label, content]) => {
                return <div className={styles.detailItemContainer} key={label}>
                    <label>{label}</label>
                    <p>{content}</p>
                </div>
            })}
        </div>
    </div>
}


export default InterviewDetail