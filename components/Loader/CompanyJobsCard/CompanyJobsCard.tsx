import Loader from 'react-content-loader'

import styles from './CompanyJobsCard.module.scss'

const CompanyJobsCard = () => {
  return (
    <div className={styles.CompanyJobsCardLoader}>
      <div className={styles.CompanyJobsCardDetailWrapper}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='10' rx='3' ry='3' style={{ width: '100%', height: '20px' }} />
          <rect x='0' y='40' rx='3' ry='3' style={{ width: '70%', height: '20px' }} />
        </Loader>
      </div>
    </div>
  )
}

export default CompanyJobsCard