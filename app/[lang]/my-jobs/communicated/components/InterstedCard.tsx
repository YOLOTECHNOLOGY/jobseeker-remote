
import React from "react";
import styles from '../index.module.scss';

const InterstedCard = ({ item }: any) => {
   const { avatar, full_name: userName } = item?.recruiter || {};
   const workJobTitle = item?.recruiter?.work_experience?.job_title
   const { name } = item?.company || {};
   const {
      job_title: jobTitle,
      local_salary_range_value: salaryRangeValue,
      job_url: jobUrl
   } = item?.job || {}

   return (
      <a href={jobUrl} className={styles.cardList}>
         <div className={styles.name}>
            <img src={avatar} />
            <p>{userName}</p>
         </div>
         <p className={styles.recruite}>{workJobTitle}, {name}</p>
         <div className={styles.name}>
            <p className={styles.jobType}>{jobTitle}</p>
            <span className={styles.salary}>{salaryRangeValue}</span>
         </div>
      </a>
   )

}

export default InterstedCard