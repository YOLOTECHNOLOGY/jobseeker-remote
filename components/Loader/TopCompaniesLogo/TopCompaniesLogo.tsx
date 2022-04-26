import Loader from 'react-content-loader'

import styles from './TopCompaniesLogo.module.scss'

const TopCompaniesLogo = () => {
  return (
    <div className={styles.topCompaniesLogo}>
      <Loader style={{ width: '100%', height: '100%' }}>
        <rect x='50' y='0' rx='0' ry='0' width='60' height='60' style={{width: '60px', height: '60px', display:'flex'}}/>
      </Loader>
    </div>
  )
}

export default TopCompaniesLogo
