import React from 'react'
import styles from './index.module.scss'
import Location from '@mui/icons-material/LocationOnOutlined';
const CustomCard = (props: any) => {

    const { content } = props
    return <div className={styles.main}>
        <div className={styles.left}>
            <div className={styles.title}>{content?.job_title}<span className={styles.salary}> {content?.salary_range_value}</span></div>
            <div className={styles.tagContent}>
                {content?.is_featured ? <div className={styles.tag}>Featured</div> : null}
                <div className={styles.tag}>{content?.job_type_value}</div>
                {content?.is_urgent ? <div className={styles.tag}>Urgent</div> : null}
            </div>
        </div>

        <div className={styles.right}>
            <div><Location fontSize="small" style={{height:14,width:14 ,top:2,right:5,position:'relative'}}/>
            {content?.full_address}</div>
            <label>{content?.recruiter?.last_active_at}</label>
        </div>
    </div>
}

export default CustomCard