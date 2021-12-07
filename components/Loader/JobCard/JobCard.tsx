import Loader from 'react-content-loader'

import styles from './JobCard.module.scss'

const JobCardLoader = () => {
  return (
    <div className={styles.JobCardLoader}>
      <div className={styles.JobCardLoaderImageWrapper}>
        <Loader
          style={{ width: '64px', height: '64px' }}
        >
          <rect x='0' y='0' rx='5' ry='5' style={{ width: '100%', height: '100%' }} />
        </Loader>
      </div>
      <div className={styles.JobCardDetailWrapper}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
          <rect x='0' y='30' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
          <rect x='0' y='80' rx='3' ry='3' style={{ width: '30%', height: '22px' }} />
          <rect x='0' y='125' rx='3' ry='3' style={{ width: '40%', height: '22px' }} />
          <rect x='0' y='155' rx='3' ry='3' style={{ width: '45%', height: '22px' }} />
          <rect x='0' y='185' rx='3' ry='3' style={{ width: '75%', height: '22px' }} />
        </Loader>
      </div>
    </div>
  )
}

export default JobCardLoader