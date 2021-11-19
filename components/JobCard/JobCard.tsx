/* Components */
import Image from 'next/image'
import Text from 'components/Text'
import JobTag from 'components/JobTag'

/* Styles */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'
import styles from './JobCard.module.scss'

import { CompanyIcon, SalaryIcon, LocationIcon } from 'images'

type JobCardProps = {
  id: number,
  image: string,
  title: string,
  tag?: string,
  company: string,
  location: string,
  salary: string,
  postedAt: string,
  selectedId?: number,
  handleSelection?: Function
}

const JobCard = ({
  id,
  image,
  title,
  tag,
  company,
  location,
  salary,
  postedAt,
  handleSelection,
  selectedId
}: JobCardProps) => {
  const cx = classNames.bind(styles)
  const isSelectedClass = cx({ isSelected: selectedId == id })

  return (
    <div 
      className={classNamesCombined([styles.JobCard, isSelectedClass])} 
      onClick={() => handleSelection(id)}
    >
      <div className={styles.JobCardImageWrapper}>
        <div className={styles.JobCardImageContent} style={{ backgroundImage: `url(${image})`}} />
      </div>
      <div className={styles.JobCardDetailWrapper}>
        <Text textStyle='xl' bold className={styles.JobCardDetailTitle}>{title}</Text>
        <div className={styles.JobCardDetailTag}>
          {tag && (
            <JobTag tag={tag} />
          )}
        </div>
        <div className={styles.JobCardDetailList}>
          <div className={styles.JobCardDetailItem}>
            <Image src={CompanyIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='base'>{company}</Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <Image src={LocationIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='base'>{location}</Text>
          </div>
          <div className={styles.JobCardDetailItem}>
            <Image src={SalaryIcon} width='20' height='20' />
            <Text className={styles.JobCardDetailItemText} textStyle='base'>{salary}</Text>
          </div>
        </div>
        <Text textStyle='xsm'>Posted on {postedAt}</Text>
      </div>
    </div>
  )
}

export default JobCard