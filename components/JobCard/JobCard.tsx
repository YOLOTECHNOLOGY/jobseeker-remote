/* Components */
import Image from 'next/image'
// import Text from 'components/Text'

/* Styles */
// import classNames from 'classnames/bind'
// import classNamesCombined from 'classnames'
import styles from './JobCard.module.scss'

import { BriefcaseIcon } from 'images'

const JobCard = () => {
  return (
    <div className={styles.JobCard}>
      <div className={styles.JobCardImageWrapper}>
        <Image src={BriefcaseIcon} alt='logo' width='13' height='13'/>
      </div>
      <div className={styles.JobCardDetailWrapper}></div>
    </div>
  )
}

export default JobCard