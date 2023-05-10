import React from 'react'
import styles from './index.module.scss'
const CustomCard = (props: any) => {

    const { content } = props
    // const jobPath = [content?.job_title, jobId].join('-')
    return <div className={styles.main}>

        <div className={styles.title}>
            <div className={styles.mainTitle}>Job in discussion:</div>
            <div
                className={styles.salary}
                onClick={() => window.open(location.origin + content.job_url)}
            > {`${content?.job_title} (${content?.job_type_value})`}</div>
        </div>
        {/* <div className={styles.description} dangerouslySetInnerHTML={{ __html: content?.job_description_html }} />
        <div className={styles.tagContent}>
            {content?.is_featured ? <div className={styles.tag}>Featured</div> : null}
            <div className={styles.tag}>{content?.job_type_value}</div>
            {content?.is_urgent ? <div className={styles.tag}>Urgent</div> : null}
        </div>
        <div className={styles.location}><Location fontSize="small" style={{ height: 14, width: 14, top: 2, right: 5, position: 'relative' }} />
            {content?.full_address}
        </div>
        <label>
            {'  '}{moment(content?.recruiter?.last_active_at).format('YY/MM/DD HH:mm')}
        </label> */}

    </div>
}

export default CustomCard