import Loader from 'react-content-loader'

import styles from './CompanyCard.module.scss'

const CompanyCard = () => {
  return (
    <div className={styles.CompanyCardLoader}>
      <div className={styles.CompanyCardLoaderImageWrapper}>
        <Loader
          style={{ width: '64px', height: '64px' }}
        >
          <rect x='0' y='0' rx='5' ry='5' style={{ width: '100%', height: '100%' }} />
        </Loader>
      </div>
      <div className={styles.CompanyCardDetailWrapper}>
        <Loader style={{ width: '100%', height: '100%' }}>
          <rect x='0' y='0' rx='3' ry='3' style={{ width: '100%', height: '20px' }} />
          <rect x='0' y='30' rx='3' ry='3' style={{ width: '70%', height: '20px' }} />
          <rect x='0' y='65' rx='3' ry='3' style={{ width: '80%', height: '20px' }} />
        </Loader>
      </div>
    </div>
  )
}

export default CompanyCard