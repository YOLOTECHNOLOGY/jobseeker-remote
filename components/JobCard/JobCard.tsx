/* Components */
import Text from 'components/Text'
import JobTag from 'components/JobTag'

/* Helpers */
import { truncateWords } from 'helpers/formatter'

/* Styles */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import styles from './JobCard.module.scss'

import { CompanyIcon, SalaryIcon, LocationIcon, ExpireIcon } from 'images'

const Warning: Array<String> = ['Not suitable']
const Happy: Array<String> = ['New', 'Under review', 'Shortlisted', 'Interviewed', 'Hired']
const Quiet: Array<String> = ['Closed', 'No show', 'Withdrawn']

type JobCardProps = {
  id: number
  image: string
  title: string
  jobType?: string
  isFeatured?: boolean
  isUrgent?: boolean
  company: string
  location: string
  salary: string
  postedAt: string
  status: string
  selectedId?: number
  handleSelectedId?: Function
  applicationStatus?: string
  applicationUpdatedAt?: string
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
  selectedId,
  applicationStatus,
  applicationUpdatedAt
}: JobCardProps) => {
  const cx = classNames.bind(styles)
  const isSelectedClass = cx({ isSelected: selectedId == id })

  const handleMyJobTagStyle = (type: string) => {
    if (Warning.includes(type)) {
      return 'warning'
    } else if (Happy.includes(type)) {
      return 'happy'
    } else if (Quiet.includes(type)) {
      return 'quiet'
    }
  }

  return (
    <div
      className={classNamesCombined([styles.JobCard, isSelectedClass])}
      onClick={() => handleSelectedId(id, title)}
    >
      <div className={styles.JobCardImageWrapper}>
        <div className={styles.JobCardImageContent} style={{ backgroundImage: `url(${image})` }} />
      </div>
      <div className={styles.JobCardDetailWrapper}>
        <Text tagName='h1' textStyle='lg' bold className={styles.JobCardDetailTitle}>
          {truncateWords(title, 60)}
        </Text>
        <div className={styles.JobCardDetailTag}>
          {isFeatured && <JobTag tag='Featured' tagType='featured' />}
          {isUrgent && <JobTag tag='Urgent' tagType='urgent' />}
          {jobType && <JobTag tag={jobType} />}
          {applicationStatus && (
            <JobTag tag={applicationStatus} tagType={handleMyJobTagStyle(applicationStatus)} />
          )}
        </div>
        <div className={styles.JobCardDetailList}>
          <div className={styles.JobCardDetailItem}>
            <img src={CompanyIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>
              {company}
            </Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <img src={LocationIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>
              {location}
            </Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <img src={SalaryIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='lg'>
              {salary}
            </Text>
          </div>
        </div>
        {status !== 'active' && (
          <Text textStyle='base' className={styles.JobCardDetailStatus}>
            <img src={ExpireIcon} height='16' width='16' />
            <span>This job is no longer hiring</span>
          </Text>
        )}

        <Text textStyle='sm'>{applicationUpdatedAt ? `Last updated on ${applicationUpdatedAt}` : `Posted on ${postedAt}`}</Text>
      </div>
    </div>
  )
}

export default JobCard
