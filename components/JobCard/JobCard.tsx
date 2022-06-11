/* Components */
import Text from 'components/Text'
import JobTag from 'components/JobTag'

/* Styles */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import styles from './JobCard.module.scss'

import { CompanyIcon, SalaryIcon, LocationIcon, ExpireIcon } from 'images'

type JobCardProps = {
  id: number,
  image: string,
  title: string,
  jobType?: string,
  isFeatured?: boolean,
  isUrgent?: boolean,
  company: string,
  location: string,
  salary: string,
  postedAt: string,
  status: string,
  selectedId?: number,
  handleSelectedId?: Function
}

const JobCard = ({
  id,
  image,
  title,
  jobType,
  isFeatured,
  isUrgent,
  company,
  location,
  salary,
  postedAt,
  status,
  handleSelectedId,
  selectedId
}: JobCardProps) => {
  const cx = classNames.bind(styles)
  const isSelectedClass = cx({ isSelected: selectedId == id })

  return (
    <div 
      className={classNamesCombined([styles.JobCard, isSelectedClass])} 
      onClick={() => handleSelectedId(id, title)}
    >
      <div className={styles.JobCardImageWrapper}>
        <div className={styles.JobCardImageContent} style={{ backgroundImage: `url(${image})`}} />
      </div>
      <div className={styles.JobCardDetailWrapper}>
        <Text tagName='h1' textStyle='lg' bold className={styles.JobCardDetailTitle}>{title}</Text>
        <div className={styles.JobCardDetailTag}>
          {isFeatured && (
            <JobTag tag='Featured' tagType='featured' />
          )}
          {isUrgent && (
            <JobTag tag='Urgent' tagType='urgent' />
          )}
          {jobType && (
            <JobTag tag={jobType} />
          )}
        </div>
        <div className={styles.JobCardDetailList}>
          <div className={styles.JobCardDetailItem}>
            <img src={CompanyIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>{company}</Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <img src={LocationIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>{location}</Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <img src={SalaryIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>{salary}</Text>
          </div>
        </div>
        {status !== 'active' && (
          <Text textStyle='md' className={styles.JobCardDetailStatus}>
            <img src={ExpireIcon} height="16" width="16"/>
            <span>This job is no longer hiring</span>
          </Text>
        )}
        <Text textStyle='sm'>Posted on {postedAt}</Text>
      </div>
    </div>
  )
}

export default JobCard