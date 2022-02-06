import Loader from 'react-content-loader'

import styles from './JobDetailSidebarCard.module.scss'

const JobDetailSidebarCard = () => {
  return (
    <div className={styles.JobDetailSidebarCard}>
      <Loader style={{ width: '100%', height: '100%' }}>
        <rect x='0' y='0' rx='3' ry='3' style={{ width: '100%', height: '22px' }} />
        <rect x='0' y='30' rx='3' ry='3' style={{ width: '80%', height: '22px' }} />
        <rect x='0' y='70' rx='3' ry='3' style={{ width: '35%', height: '22px' }} />
        <rect x='0' y='100' rx='3' ry='3' style={{ width: '65%', height: '22px' }} />
        <rect x='0' y='130' rx='3' ry='3' style={{ width: '50%', height: '22px' }} />
      </Loader>
    </div>
  )
}

export default JobDetailSidebarCard