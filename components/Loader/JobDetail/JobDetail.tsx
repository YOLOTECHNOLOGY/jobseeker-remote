import Loader from 'react-content-loader'

import styles from './JobDetail.module.scss'

const JobDetail = () => {
  return (
    <div className={styles.JobDetailLoader}>
      <div className={styles.JobDetailLoaderOption} />
      <div className={styles.JobDetailLoaderHeader}>
        <Loader
          className={styles.JobDetailLoaderImage}
          style={{ width: '78px', height: '78px' }}
        >
          <rect x='0' y='0' rx='5' ry='5' style={{ width: '100%', height: '100%' }} />
        </Loader>
        <div className={styles.JobDetailLoaderInfo}>
          <Loader style={{ width: '100%', height: '100%' }}>
            <rect x='0' y='0' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
            <rect x='0' y='40' rx='3' ry='3' style={{ width: '40%', height: '22px' }} />
            <rect x='0' y='75' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
            <rect x='0' y='110' rx='3' ry='3' style={{ width: '30%', height: '50px' }} />
          </Loader>
        </div>
      </div>
      <div className={styles.JobDetailLoaderPref}>
        <Loader style={{ width: '100%', height: '80px' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '100%', height: '80px' }} />
        </Loader>
      </div>
      <div className={styles.JobDetailLoaderSection}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '30%', height: '22px' }} />
          <rect x='0' y='40' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
          <rect x='0' y='70' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
          <rect x='0' y='100' rx='3' ry='3' style={{ width: '50%', height: '22px' }} />
          <rect x='0' y='130' rx='3' ry='3' style={{ width: '80%', height: '22px' }} />
        </Loader>
      </div>
      <div className={styles.JobDetailLoaderSection}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '90%', height: '22px' }} />
          <rect x='0' y='35' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
          <rect x='0' y='65' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
          <rect x='0' y='95' rx='3' ry='3' style={{ width: '50%', height: '22px' }} />
          <rect x='0' y='125' rx='3' ry='3' style={{ width: '80%', height: '22px' }} />
        </Loader>
      </div>
      <div className={styles.JobDetailLoaderSection}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '30%', height: '22px' }} />
          <rect x='0' y='40' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
          <rect x='0' y='70' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
          <rect x='0' y='100' rx='3' ry='3' style={{ width: '50%', height: '22px' }} />
          <rect x='0' y='130' rx='3' ry='3' style={{ width: '80%', height: '22px' }} />
        </Loader>
      </div>
      <div className={styles.JobDetailLoaderSection}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '90%', height: '22px' }} />
          <rect x='0' y='35' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
          <rect x='0' y='65' rx='3' ry='3' style={{ width: '70%', height: '22px' }} />
          <rect x='0' y='95' rx='3' ry='3' style={{ width: '50%', height: '22px' }} />
          <rect x='0' y='125' rx='3' ry='3' style={{ width: '80%', height: '22px' }} />
        </Loader>
      </div>

    </div>
  )
}

export default JobDetail